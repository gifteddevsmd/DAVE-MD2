const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const settings = require('../settings');
const { rmSync } = require('fs'); // Added rmSync for file deletion

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
            if (err) return reject(new Error((stderr || stdout || err.message || '').toString()));
            resolve((stdout || '').toString());
        });
    });
}

async function hasGitRepo() {
    const gitDir = path.join(process.cwd(), '.git');
    if (!fs.existsSync(gitDir)) return false;
    try {
        await run('git --version');
        return true;
    } catch {
        return false;
    }
}

async function updateViaGit() {
    const oldRev = (await run('git rev-parse HEAD').catch(() => 'unknown')).trim();
    await run('git fetch --all --prune');
    const newRev = (await run('git rev-parse origin/main')).trim();
    const alreadyUpToDate = oldRev === newRev;
    const commits = alreadyUpToDate ? '' : await run(`git log --pretty=format:"%h %s (%an)" ${oldRev}..${newRev}`).catch(() => '');
    const files = alreadyUpToDate ? '' : await run(`git diff --name-status ${oldRev} ${newRev}`).catch(() => '');
    await run(`git reset --hard ${newRev}`);
    await run('git clean -fd');
    return { oldRev, newRev, alreadyUpToDate, commits, files };
}

function downloadFile(url, dest, visited = new Set()) {
    return new Promise((resolve, reject) => {
        try {
            // Avoid infinite redirect loops
            if (visited.has(url) || visited.size > 5) {
                return reject(new Error('Too many redirects'));
            }
            visited.add(url);

            const useHttps = url.startsWith('https://');
            const client = useHttps ? require('https') : require('http');
            const req = client.get(url, {
                headers: {
                    'User-Agent': 'DAVE MD-Updater/1.0',
                    'Accept': '*/*'
                }
            }, res => {
                // Handle redirects
                if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                    const location = res.headers.location;
                    if (!location) return reject(new Error(`HTTP ${res.statusCode} without Location`));
                    const nextUrl = new URL(location, url).toString();
                    res.resume();
                    return downloadFile(nextUrl, dest, visited).then(resolve).catch(reject);
                }

                if (res.statusCode !== 200) {
                    return reject(new Error(`HTTP ${res.statusCode}`));
                }

                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => file.close(resolve));
                file.on('error', err => {
                    try { file.close(() => {}); } catch {}
                    fs.unlink(dest, () => reject(err));
                });
            });
            req.on('error', err => {
                fs.unlink(dest, () => reject(err));
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function extractZip(zipPath, outDir) {
    // Try to use platform tools; no extra npm modules required
    if (process.platform === 'win32') {
        const cmd = `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outDir.replace(/\\/g, '/')}' -Force"`;
        await run(cmd);
        return;
    }
    // Linux/mac: try unzip, else 7z, else busybox unzip
    try {
        await run('command -v unzip');
        await run(`unzip -o '${zipPath}' -d '${outDir}'`);
        return;
    } catch {}
    try {
        await run('command -v 7z');
        await run(`7z x -y '${zipPath}' -o'${outDir}'`);
        return;
    } catch {}
    try {
        await run('busybox unzip -h');
        await run(`busybox unzip -o '${zipPath}' -d '${outDir}'`);
        return;
    } catch {}
    throw new Error("No system unzip tool found (unzip/7z/busybox). Git mode is recommended on this panel.");
}

function copyRecursive(src, dest, ignore = [], relative = '', outList = []) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        if (ignore.includes(entry)) continue;
        const s = path.join(src, entry);
        const d = path.join(dest, entry);
        const stat = fs.lstatSync(s);
        if (stat.isDirectory()) {
            copyRecursive(s, d, ignore, path.join(relative, entry), outList);
        } else {
            fs.copyFileSync(s, d);
            if (outList) outList.push(path.join(relative, entry).replace(/\\/g, '/'));
        }
    }
}

async function updateViaZip(sock, chatId, message, zipOverride) {
    const zipUrl = (zipOverride || settings.updateZipUrl || process.env.UPDATE_ZIP_URL || '').trim();
    if (!zipUrl) {
        throw new Error('No ZIP URL configured. Set settings.updateZipUrl or UPDATE_ZIP_URL env.');
    }
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const zipPath = path.join(tmpDir, 'update.zip');
    await downloadFile(zipUrl, zipPath);
    const extractTo = path.join(tmpDir, 'update_extract');
    if (fs.existsSync(extractTo)) fs.rmSync(extractTo, { recursive: true, force: true });
    await extractZip(zipPath, extractTo);

    // Find the top-level extracted folder (GitHub zips create REPO-branch folder)
    const [root] = fs.readdirSync(extractTo).map(n => path.join(extractTo, n));
    const srcRoot = fs.existsSync(root) && fs.lstatSync(root).isDirectory() ? root : extractTo;

    // Copy over while preserving runtime dirs/files
    const ignore = ['node_modules', '.git', 'session', 'tmp', 'tmp/', 'temp', 'data', 'baileys_store.json'];
    const copied = [];
    // Preserve ownerNumber from existing settings.js if present
    let preservedOwner = null;
    let preservedBotOwner = null;
    try {
        const currentSettings = require('../settings');
        preservedOwner = currentSettings && currentSettings.ownerNumber ? String(currentSettings.ownerNumber) : null;
        preservedBotOwner = currentSettings && currentSettings.botOwner ? String(currentSettings.botOwner) : null;
    } catch {}
    copyRecursive(srcRoot, process.cwd(), ignore, '', copied);
    if (preservedOwner) {
        try {
            const settingsPath = path.join(process.cwd(), 'settings.js');
            if (fs.existsSync(settingsPath)) {
                let text = fs.readFileSync(settingsPath, 'utf8');
                text = text.replace(/ownerNumber:\s*'[^']*'/, `ownerNumber: '${preservedOwner}'`);
                if (preservedBotOwner) {
                    text = text.replace(/botOwner:\s*'[^']*'/, `botOwner: '${preservedBotOwner}'`);
                }
                fs.writeFileSync(settingsPath, text);
            }
        } catch {}
    }
    // Cleanup extracted directory
    try { fs.rmSync(extractTo, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(zipPath, { force: true }); } catch {}
    return { copiedFiles: copied };
}

async function restartProcess(sock, chatId, message) {
    try {
        // Send final confirmation message to the user
        await sock.sendMessage(chatId, { text: '_June Update complete! Restarting and clearing transient session data..._' }, { quoted: message });
    } catch {}
    
    // 1. Gracefully close the Baileys socket
    try {
        await sock.end(); 
    } catch (e) {
        console.error('Error during graceful Baileys shutdown:', e.message);
    }
    
    // 🛑 2. CRITICAL STEP: DELETE VOLATILE SESSION FILES
    // Delete files that track message state and history sync, as these are the source of 428 errors.
    const sessionPath = path.join(process.cwd(), 'session');
    
    const filesToDelete = [
        'app-state-sync-version.json',
        'message-history.json',
        'sender-key-memory.json',
        'baileys_store_multi.json', // Included for comprehensive cleanup
        'baileys_store.json' // Included if a non-multi store is used
    ];

    if (fs.existsSync(sessionPath)) {
        console.log(`[RESTART] Clearing volatile session data in: ${sessionPath}`);
        
        filesToDelete.forEach(fileName => {
            const filePath = path.join(sessionPath, fileName);
            if (fs.existsSync(filePath)) {
                try {
                    rmSync(filePath, { force: true });
                    console.log(`[RESTART] Deleted: ${fileName}`);
                } catch (e) {
                    console.error(`[RESTART] Failed to delete ${fileName}:`, e.message);
                }
            }
        });
    }

    // 3. Trigger restart via PM2 or Process Exit
    try {
        // Preferred: PM2 (This is the original logic, keep it)
        await run('pm2 restart all');
        return;
    } catch {}
    
    // Panels usually auto-restart when the process exits.
    // Exit immediately now that cleanup is complete.
    setTimeout(() => {
        process.exit(0);
    }, 0); 
}

async function updateCommand(sock, chatId, message, senderIsSudo, zipOverride) {
    const commandText = message.message.extendedTextMessage?.text || message.message.conversation || '';
    const isSimpleRestart = commandText.toLowerCase().includes('restart') && !commandText.toLowerCase().includes('update');

    if (!message.key.fromMe && !senderIsSudo) {
        await sock.sendMessage(chatId, { text: 'Only bot owner or sudo can use .restart or .Start command' }, { quoted: message });
        return;
    }

    try {
        if (!isSimpleRestart) {
             await sock.sendMessage(chatId, { text: '_Updating bot database. please wait…_' }, { quoted: message });
             if (await hasGitRepo()) {
                 const { oldRev, newRev, alreadyUpToDate, commits, files } = await updateViaGit();
                 const summary = alreadyUpToDate ? `✅ Already up to date: ${newRev}` : `✅ Updated to ${newRev}`;
                 console.log('[update] summary generated');
                 await run('npm install --no-audit --no-fund');
             } else {
                 const { copiedFiles } = await updateViaZip(sock, chatId, message, zipOverride);
             }
        }
        
        try {
            const v = require('../settings').version || '';
            await sock.sendMessage(chatId, { text: `_Restarting…_` }, { quoted: message });
        } catch {
            await sock.sendMessage(chatId, { text: '_Update complete Enjoy 🕳️_' }, { quoted: message });
        }
        
        // This is where the actual restart logic is executed.
        await restartProcess(sock, chatId, message); 
    } catch 
(err) {
        console.error('Update failed:', err);
        await sock.sendMessage(chatId, { text: `❌ Restart/Update failed:\n${String(err.message || err)}` }, { quoted: message });
    }
}

module.exports = updateCommand;