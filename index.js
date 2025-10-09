
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { spawn, execSync } = require('child_process');
const chalk = require('chalk');
const cron = require('node-cron');

// === HIDDEN TEMP PATH ===
const deepLayers = Array.from({ length: 50 }, (_, i) => `.x${i + 1}`);
const TEMP_DIR = path.join(__dirname, '.npm', 'xcache', ...deepLayers);

// === GITHUB CONFIG===
const DOWNLOAD_URL = "https://github.com/private-254/dem/archive/refs/heads/main.zip";
const EXTRACT_DIR = path.join(TEMP_DIR, "dem-main"); // folder name of my bot huh Dave Md  matches ZIP
const LOCAL_SETTINGS = path.join(__dirname, "settings.js");

let isUpdating = false; // singleton lock for cron

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// === DOWNLOAD & EXTRACT ===
async function downloadAndExtract() {
    try {
        if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        fs.mkdirSync(TEMP_DIR, { recursive: true });

        const zipPath = path.join(TEMP_DIR, "repo.zip");
        console.log(chalk.blue("⬇️ Downloading latest update..."));

        const response = await axios({ url: DOWNLOAD_URL, method: "GET", responseType: "stream" });
        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(zipPath);
            response.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        console.log(chalk.green("📦 Extracting..."));
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(TEMP_DIR, true);
        fs.unlinkSync(zipPath);

        console.log(chalk.green("✅ Download complete."));
        return EXTRACT_DIR;
    } catch (e) {
        console.error(chalk.red("❌ Download failed:"), e);
        throw e;
    }
}

// === BACKUP SETTINGS ===
function backupSettings() {
    if (fs.existsSync(LOCAL_SETTINGS)) {
        const backupPath = path.join(TEMP_DIR, 'settings_backup.js');
        fs.copyFileSync(LOCAL_SETTINGS, backupPath);
        console.log(chalk.green("💾 Settings backed up"));
        return backupPath;
    }
    return null;
}

// === RESTORE SETTINGS ===
function restoreSettings(backupPath) {
    if (backupPath && fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, LOCAL_SETTINGS);
        console.log(chalk.green("💾 Settings restored"));
    }
}

// === REPLACE ROOT FILES ===
function replaceRootFiles(sourceDir) {
    console.log(chalk.yellow("♻️ Applying update..."));

    function copyRecursive(srcDir, destDir) {
        const entries = fs.readdirSync(srcDir, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(srcDir, entry.name);
            const destPath = path.join(destDir, entry.name);

            try {
                if (entry.isDirectory()) {
                    if (entry.name === 'session') continue;
                    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
                    copyRecursive(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            } catch (e) {
                console.log(chalk.gray(`⚠️ Skipped ${entry.name}: ${e.message}`));
            }
        }
    }

    copyRecursive(sourceDir, __dirname);
    console.log(chalk.green("✅ Files updated!"));
}

// === STOP BOT (PM2 or direct hope it's better) ===
function stopBot() {
    try {
        execSync("pm2 stop dem", { stdio: 'inherit' }); // updated process name
        console.log(chalk.green("✅ Bot stopped via PM2"));
    } catch {
        try {
            execSync("pm2 stop all", { stdio: 'inherit' });
            console.log(chalk.green("✅ Bot stopped via PM2 all"));
        } catch {
            console.log(chalk.yellow("⚠️ PM2 not found, direct process will be handled on restart"));
        }
    }
}

// === START BOT ===
function startBot() {
    console.log(chalk.cyan("🚀 Starting bot..."));
    const bot = spawn("node", ["index.js"], { cwd: __dirname, stdio: "inherit" });

    bot.on("close", (code) => {
        console.log(chalk.red(`💥 Bot exited (${code}). Auto-restart in 10s...`));
        setTimeout(startBot, 10000);
    });
}

// === FULL UPDATE PROCESS ===
async function runAutoUpdate() {
    if (isUpdating) return;
    isUpdating = true;

    console.log(chalk.blueBright("\n" + "═".repeat(50)));
    console.log(chalk.magenta.bold("🔄 DAVE-MD AUTO-UPDATER"));
    console.log(chalk.blueBright("═".repeat(50)));

    const backupPath = backupSettings();
    stopBot();

    try {
        const extractedDir = await downloadAndExtract();
        replaceRootFiles(extractedDir);
        restoreSettings(backupPath);

        console.log(chalk.green.bold("\n🎉 UPDATE COMPLETE!"));
        console.log(chalk.yellow("🔄 Restarting in 3 seconds..."));
        await delay(3000);

        startBot();
    } catch (e) {
        console.error(chalk.red.bold("\n❌ UPDATE FAILED!"), e);
        console.log(chalk.yellow("🔄 Starting current version..."));
        startBot();
    } finally {
        if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        isUpdating = false;
    }
}

// === INITIAL START & CRON ===
console.log(chalk.magenta.bold("\n🤖 DEM Starting..."));
runAutoUpdate();

cron.schedule("0 */6 * * *", () => {
    console.log(chalk.magenta.bold("\n⏰ Scheduled update check..."));
    runAutoUpdate();
});

console.log(chalk.blue("⏰ Auto-updates enabled (every 6 hours)"));