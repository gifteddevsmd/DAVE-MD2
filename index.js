require('dotenv').config() // CRITICAL: Load .env variables first!

// *******************************************************************
// *** CRITICAL CHANGE: REQUIRED FILES (settings.js, main, etc.) ***
// *** HAVE BEEN REMOVED FROM HERE AND MOVED BELOW THE CLONER RUN. ***
// *******************************************************************

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
// The smsg utility also depends on other files, so we'll move its require statement.
// const { smsg } = require('./lib/myfunc') 
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay 
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync } = require('fs')

// --- 🌟 NEW: Centralized Logging Function ---
/**
 * Custom logging function to enforce the [ DAVE-MD ] prefix and styling.
 * @param {string} message - The message to log.
 * @param {string} [color='white'] - The chalk color (e.g., 'green', 'red', 'yellow').
 * @param {boolean} [isError=false] - Whether to use console.error.
 */
function log(message, color = 'white', isError = false) {
    const prefix = chalk.magenta.bold('[ DAVE-MD ]');
    const logFunc = isError ? console.error : console.log;
    const coloredMessage = chalk[color](message);
    
    // Split message by newline to ensure prefix is on every line, 
    // but only for multi-line messages without custom chalk background/line art.
    if (message.includes('\n') || message.includes('════')) {
        logFunc(prefix, coloredMessage);
    } else {
         logFunc(`${prefix} ${coloredMessage}`);
    }
}
// -------------------------------------------

// --- GLOBAL FLAGS ---
global.isBotConnected = false; 
global.connectDebounceTimeout = null;
// --- NEW: Error State Management ---
global.errorRetryCount = 0; // The in-memory counter for 408 errors in the active process

// ***************************************************************
// *** DEPENDENCIES MOVED DOWN HERE (AFTER THE CLONING IS COMPLETE) ***
// ***************************************************************

// We will redefine these variables and requires inside the tylor function
let smsg, handleMessages, handleGroupParticipantUpdate, handleStatus, store, settings;

// --- 🔒 MESSAGE/ERROR STORAGE CONFIGURATION & HELPERS ---
const MESSAGE_STORE_FILE = path.join(__dirname, 'message_backup.json');
// --- NEW: Error Counter File ---
const SESSION_ERROR_FILE = path.join(__dirname, 'sessionErrorCount.json');
global.messageBackup = {};

function loadStoredMessages() {
    try {
        if (fs.existsSync(MESSAGE_STORE_FILE)) {
            const data = fs.readFileSync(MESSAGE_STORE_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        log(`Error loading message backup store: ${error.message}`, 'red', true);
    }
    return {};
}

function saveStoredMessages(data) {
    try {
        fs.writeFileSync(MESSAGE_STORE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        log(`Error saving message backup store: ${error.message}`, 'red', true);
    }
}
global.messageBackup = loadStoredMessages();

// --- NEW: Error Counter Helpers ---
function loadErrorCount() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) {
            const data = fs.readFileSync(SESSION_ERROR_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        log(`Error loading session error count: ${error.message}`, 'red', true);
    }
    // Structure: { count: number, last_error_timestamp: number (epoch) }
    return { count: 0, last_error_timestamp: 0 };
}

function saveErrorCount(data) {
    try {
        fs.writeFileSync(SESSION_ERROR_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        log(`Error saving session error count: ${error.message}`, 'red', true);
    }
}

function deleteErrorCountFile() {
    try {
        if (fs.existsSync(SESSION_ERROR_FILE)) {
            fs.unlinkSync(SESSION_ERROR_FILE);
            log('✅ Deleted sessionErrorCount.json.', 'red');
        }
    } catch (e) {
        log(`Failed to delete sessionErrorCount.json: ${e.message}`, 'red', true);
    }
}

// --- ♻️ CLEANUP FUNCTIONS ---

/**
 * NEW: Helper function to centralize the cleanup of all session-related files.
 */
function clearSessionFiles() {
    try {
        log('🗑️ Clearing session folder...', 'blue');
        // Delete the entire session directory
        rmSync(sessionDir, { recursive: true, force: true });
        // Delete login file if it exists
        if (fs.existsSync(loginFile)) fs.unlinkSync(loginFile);
        // Delete error count file
        deleteErrorCountFile();
        global.errorRetryCount = 0; // Reset in-memory counter
        log('✅ Session files cleaned successfully.', 'green');
    } catch (e) {
        log(`Failed to clear session files: ${e.message}`, 'red', true);
    }
}

function cleanupOldMessages() {
    let storedMessages = loadStoredMessages();
    let now = Math.floor(Date.now() / 1000);
    const maxMessageAge = 24 * 60 * 60;
    let cleanedMessages = {};
    for (let chatId in storedMessages) {
        let newChatMessages = {};
        for (let messageId in storedMessages[chatId]) {
            let message = storedMessages[chatId][messageId];
            if (now - message.timestamp <= maxMessageAge) {
                newChatMessages[messageId] = message; 
            }
        }
        if (Object.keys(newChatMessages).length > 0) {
            cleanedMessages[chatId] = newChatMessages; 
        }
    }
    saveStoredMessages(cleanedMessages);
    log("🧹 [Msg Cleanup] Old messages removed from message_backup.json", 'yellow');
}

function cleanupJunkFiles(botSocket) {
    let directoryPath = path.join(); 
    fs.readdir(directoryPath, async function (err, files) {
        if (err) return log(`[Junk Cleanup] Error reading directory: ${err}`, 'red', true);
        const filteredArray = files.filter(item =>
            item.endsWith(".gif") || item.endsWith(".png") || item.endsWith(".mp3") ||
            item.endsWith(".mp4") || item.endsWith(".opus") || item.endsWith(".jpg") ||
            item.endsWith(".webp") || item.endsWith(".webm") || item.endsWith(".zip")
        );
        if (filteredArray.length > 0) {
            let teks = `Detected ${filteredArray.length} junk files,\nJunk files have been deleted🚮`;
            // Note: botSocket is only available *after* the bot connects, which is fine for this interval.
            if (botSocket && botSocket.user && botSocket.user.id) {
                botSocket.sendMessage(botSocket.user.id.split(':')[0] + '@s.whatsapp.net', { text: teks });
            }
            filteredArray.forEach(function (file) {
                const filePath = path.join(directoryPath, file);
                try {
                    if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
                } catch(e) {
                    log(`[Junk Cleanup] Failed to delete file ${file}: ${e.message}`, 'red', true);
                }
            });
            log(`[Junk Cleanup] ${filteredArray.length} files deleted.`, 'yellow');
        }
    });
}

// --- DAVE MD ORIGINAL CODE START ---
global.botname = "DAVE-MD"
global.themeemoji = "•"
const pairingCode = !!global.phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// --- Readline setup (DAVE MD) ---
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
// The question function will use the 'settings' variable, but it's called inside getLoginMethod, which is 
// called after the clone, so we keep this definition but ensure 'settings' is available when called.
const question = (text) => rl ? new Promise(resolve => rl.question(text, resolve)) : Promise.resolve(settings?.ownerNumber || global.phoneNumber)

// --- Paths (DAVE MD) ---
const sessionDir = path.join(__dirname, 'session')
const credsPath = path.join(sessionDir, 'creds.json')
const loginFile = path.join(sessionDir, 'login.json')
const envPath = path.join(__dirname, '.env') // Path to the .env file

// --- Login persistence (DAVE MD) ---
async function saveLoginMethod(method) {
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(loginFile, JSON.stringify({ method }, null, 2));
}

async function getLastLoginMethod() {
    if (fs.existsSync(loginFile)) {
        const data = JSON.parse(fs.readFileSync(loginFile, 'utf-8'));
        return data.method;
    }
    return null;
}

// --- Session check (DAVE MD) ---
function sessionExists() {
    return fs.existsSync(credsPath);
}

// --- NEW: Check and use SESSION_ID from .env/environment variables ---
async function checkEnvSession() {
    const envSessionID = process.env.SESSION_ID;
    if (envSessionID) {
        if (!envSessionID.includes("dave~")) { 
            log("🚨 WARNING: Environment SESSION_ID is missing the required prefix 'dave~'. Assuming BASE64 format.", 'red'); 
        }
        global.SESSION_ID = envSessionID.trim();
        return true;
    }
    return false;
}

/**
 * NEW LOGIC: Checks if SESSION_ID starts with "DAVE-MD". If not, cleans .env and restarts.
 */
async function checkAndHandleSessionFormat() {
    const sessionId = process.env.SESSION_ID;
    
    if (sessionId && sessionId.trim() !== '') {
        // Only check if it's set and non-empty
        if (!sessionId.trim().startsWith('dave~')) {
            log(chalk.red.bgBlack('================================================='), 'white');
            log(chalk.white.bgRed('❌ ERROR: Invalid SESSION_ID in .env'), 'white');
            log(chalk.white.bgRed('The session ID MUST start with "DAVE-MD".'), 'white');
            log(chalk.white.bgRed('Cleaning .env and creating new one...'), 'white');
            log(chalk.red.bgBlack('================================================='), 'white');
            
            try {
                let envContent = fs.readFileSync(envPath, 'utf8');
                
                // Use regex to replace only the SESSION_ID line while preserving other variables
                envContent = envContent.replace(/^SESSION_ID=.*$/m, 'SESSION_ID=');
                
                fs.writeFileSync(envPath, envContent);
                log('✅ Cleaned SESSION_ID entry in .env file.', 'green');
                log('Please add a proper session ID and restart the bot.', 'yellow');
            } catch (e) {
                log(`Failed to modify .env file. Please check permissions: ${e.message}`, 'red', true);
            }
            
            // Delay before exiting to allow user to read the message before automatic restart
            log('Bot will wait 30 seconds then restart', 'blue');
            await delay(30000);
            
            // Exit with code 1 to ensure the hosting environment restarts the process
            process.exit(1);
        }
    }
}

// --- Get login method (DAVE MD) ---
async function getLoginMethod() {
    const lastMethod = await getLastLoginMethod();
    if (lastMethod && sessionExists()) {
        log(`Last login method detected: ${lastMethod}. Using it automatically.`, 'yellow');
        return lastMethod;
    }
    
    if (!sessionExists() && fs.existsSync(loginFile)) {
        log(`Session files missing. Removing old login preference for clean re-login.`, 'yellow');
        fs.unlinkSync(loginFile);
    }

    // Interactive prompt for Pterodactyl/local
    if (!process.stdin.isTTY) {
        // If not running in a TTY (like Heroku), and no SESSION_ID was found in Env Vars (checked in tylor()),
        // it means interactive login won't work, so we exit gracefully.
        log("❌ No Session ID found in environment variables.", 'red');
        process.exit(1);
    }

    log("Choose login method:", 'yellow');
    log("1) Enter WhatsApp Number (Pairing Code)", 'blue');
    log("2) Paste Session ID", 'blue');

    let choice = await question("Enter option number (1 or 2): ");
    choice = choice.trim();

    if (choice === '1') {
        let phone = await question(chalk.bgBlack(chalk.greenBright(`Enter your WhatsApp number (e.g., 6281376552730): `)));
        phone = phone.replace(/[^0-9]/g, '');
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phone).isValid()) { log('Invalid phone number.', 'red'); return getLoginMethod(); }
        global.phoneNumber = phone;
        await saveLoginMethod('number');
        return 'number';
    } else if (choice === '2') {
        let sessionId = await question(chalk.bgBlack(chalk.greenBright(`Paste your Session ID here: `)));
        sessionId = sessionId.trim();
        // Pre-check the format during interactive entry as well
        if (!sessionId.includes("dave~")) { 
            log("Invalid Session ID format! Must contain 'dave~'.", 'red'); 
            process.exit(1); 
        }
        global.SESSION_ID = sessionId;
        await saveLoginMethod('session');
        return 'session';
    } else {
        log("Invalid option! Please choose 1 or 2.", 'red');
        return getLoginMethod();
    }
}

// --- Download session (DAVE MD) ---
async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });
        if (!fs.existsSync(credsPath) && global.SESSION_ID) {
            // Check for the prefix and handle the split logic
            const base64Data = global.SESSION_ID.includes("dave~") ? global.SESSION_ID.split("dave~")[1] : global.SESSION_ID;
            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            log(`Session successfully saved.`, 'green');
        }
    } catch (err) { log(`Error downloading session data: ${err.message}`, 'red', true); }
}

// --- Request pairing code (DAVE MD) ---
async function requestPairingCode(socket) {
    try {
        log("Waiting 3 seconds for socket stabilization before requesting pairing code...", 'yellow');
        await delay(3000); 

        let code = await socket.requestPairingCode(global.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        log(chalk.bgGreen.black(`\nYour Pairing Code: ${code}\n`), 'white');
        log(`
Please enter this code in WhatsApp app:
1. Open WhatsApp
2. Go to Settings => Linked Devices
3. Tap "Link a Device"
4. Enter the code shown above
        `, 'green');
        return true; 
    } catch (err) { 
        log(`Failed to get pairing code: ${err.message}`, 'red', true); 
        return false; 
    }
}

// --- Dedicated function to handle post-connection initialization and welcome message
async function sendWelcomeMessage(dave) {
    // Safety check: Only proceed if the welcome message hasn't been sent yet in this session.
    if (global.isBotConnected) return; 
    
    try {
        if (!dave.user || global.isBotConnected) return;

        global.isBotConnected = true;
        const pNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';

        // Auto-follow channel immediately after connection (before welcome message)
        await delay(1999); // Short delay for stability
        
        try {
            await dave.newsletterFollow("120363400480173280@newsletter");
            console.log(chalk.cyan(`✅ auto-followed your WhatsApp channel successfully!`));
        } catch (e) {
            console.log(chalk.red(`❌ failed to follow channel: ${e}`));
        }

        // CRITICAL: Wait additional seconds for the connection to fully stabilize before welcome message
        await delay(8000); // Total ~10 seconds delay

        // Send the welcome message
        await dave.sendMessage(pNumber, {
            text: 
            `
┏➤ *𝙳𝙰𝚅𝙴-𝙼𝙳 CONNECTED* ➤
┃➤ *Bot:* ${global.botname}
┃➤ *Time:* ${new Date().toLocaleString()}
┃➤ *Status:* Online
┃➤ *User:* ${dave.user.id.split(':')[0]}
┗➤────────────➤
`
        });
        log('✅ Bot successfully connected to Whatsapp.', 'green');

        // NEW: Reset the error counter on successful connection
        deleteErrorCountFile();
        global.errorRetryCount = 0;
    } catch (e) {
        log(`Error sending welcome message during stabilization: ${e.message}`, 'red', true);
        global.isBotConnected = false;
    }
}

/**
 * NEW FUNCTION: Handles the logic for persistent 408 (timeout) errors.
 * @param {number} statusCode The disconnect status code.
 */
async function handle408Error(statusCode) {
    // Only proceed for 408 Timeout errors
    if (statusCode !== DisconnectReason.connectionTimeout) return false;
    
    global.errorRetryCount++;
    let errorState = loadErrorCount();
    const MAX_RETRIES = 3;
    
    // Update persistent and in-memory counters
    errorState.count = global.errorRetryCount;
    errorState.last_error_timestamp = Date.now();
    saveErrorCount(errorState);

    log(`Connection Timeout (408) detected. Retry count: ${global.errorRetryCount}/${MAX_RETRIES}`, 'yellow');
    
    if (global.errorRetryCount >= MAX_RETRIES) {
        log(chalk.red.bgBlack('================================================='), 'white');
        log(chalk.white.bgRed(`🚨 MAX CONNECTION TIMEOUTS (${MAX_RETRIES}) REACHED IN ACTIVE STATE. `), 'white');
        log(chalk.white.bgRed('This indicates a persistent network or session issue.'), 'white');
        log(chalk.white.bgRed('Exiting process to stop infinite restart loop.'), 'white');
        log(chalk.red.bgBlack('================================================='), 'white');

        deleteErrorCountFile();
        global.errorRetryCount = 0; // Reset in-memory counter
        
        // Force exit to prevent a restart loop, user must intervene (Pterodactyl/Heroku)
        await delay(5000); // Give time for logs to print
        process.exit(1);
    }
    return true;
}

// --- Start bot (DAVE MD) ---
async function startdave() {
    log('Connecting to WhatsApp...', 'cyan');
    const { version } = await fetchLatestBaileysVersion();
    
    // Ensure session directory exists before Baileys attempts to use it
    await fs.promises.mkdir(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const msgRetryCounterCache = new NodeCache();

    const dave = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, 
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            // This now uses the globally available 'store' which is loaded inside tylor()
            let msg = await store.loadMessage(jid, key.id); 
            return msg?.message || "";
        },
        msgRetryCounterCache
    });

    store.bind(dave.ev);

    
    // --- 🚨 MESSAGE LOGGER ---
    dave.ev.on('messages.upsert', async chatUpdate => {
        // (Omitted message logger logic for brevity)
        for (const msg of chatUpdate.messages) {
              if (!msg.message) continue;
              let chatId = msg.key.remoteJid;
              let messageId = msg.key.id;
              if (!global.messageBackup[chatId]) { global.messageBackup[chatId] = {}; }
              let textMessage = msg.message?.conversation || msg.message?.extendedTextMessage?.text || null;
              if (!textMessage) continue;
              let savedMessage = { sender: msg.key.participant || msg.key.remoteJid, text: textMessage, timestamp: msg.messageTimestamp };
              if (!global.messageBackup[chatId][messageId]) { global.messageBackup[chatId][messageId] = savedMessage; saveStoredMessages(global.messageBackup); }
        }

        // --- DAVE MD ORIGINAL HANDLER ---
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        // This relies on handleStatus and handleMessages being loaded
        if (mek.key.remoteJid === 'status@broadcast') { await handleStatus(dave, chatUpdate); return; }
        try { await handleMessages(dave, chatUpdate, true) } catch(e){ log(e.message, 'red', true) }
    });

    dave.ev.on('messages.reaction', async (reaction) => {
    try {
        await handleStatus(dave, reaction);
    } catch (error) {
        console.error('Error in messages.reaction handler:', error);
    }
});

    // --- ⚠️ CONNECTION UPDATE LISTENER (Enhanced Logic with 401/408 handler)
    dave.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            global.isBotConnected = false; 
            
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            // Capture both DisconnectReason.loggedOut (sometimes 401) and explicit 401 error
            const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;
            
            // Log and handle permanent errors (logged out, invalid session)
            if (permanentLogout) {
                log(chalk.bgRed.black(`\n\n🚨 WhatsApp Disconnected! Status Code: ${statusCode} (LOGGED OUT / INVALID SESSION).`), 'white');
                log('🗑️ Deleting session folder and forcing a clean restart...', 'red');
                
                // AUTOMATICALLY DELETE SESSION (using the new helper)
                clearSessionFiles();
                
                log('✅ Session, login preference, and error count cleaned. Initiating full process restart in 5 seconds...', 'red');
                await delay(5000);
                
                // CRITICAL FIX: Use process.exit(1) to trigger a clean restart by the Daemon
                process.exit(1); 
                
            } else {
                // NEW: Handle the 408 Timeout Logic FIRST
                const is408Handled = await handle408Error(statusCode);
                if (is408Handled) {
                    // If handle408Error decides to exit, it will already have called process.exit(1)
                    return;
                }

                // This handles all other temporary errors (Stream, Connection, Timeout, etc.)
                log(`Connection closed due to temporary issue (Status: ${statusCode}). Attempting reconnect...`, 'yellow');
                // Re-start the whole bot process (this handles temporary errors/reconnects)
                startdave(); 
            }
        } else if (connection === 'open') { 
            console.log(chalk.magenta(`© DAVE CONSOLE`))
            console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(dave.user, null, 2)))
            log('DAVE-MD connected', 'blue');      
            log(`GITHUB: giftdee`, 'magenta');
            
            // Handle auto-follow immediately after connection
            await handleAutoFollow(dave);
            
            // Send the welcome message (which includes the 10s stability delay and error reset)
            await sendWelcomeMessage(dave);
        }
    });
    
    const antiCallNotified = new Set();

    // Anticall handler: block callers when enabled
    dave.ev.on('call', async (calls) => {
        try {
            const { readState: readAnticallState } = require('./commands/anticall');
            const state = readAnticallState();
            if (!state.enabled) return;
            
            for (const call of calls) {
                const callerJid = call.from || call.peerJid || call.chatId;
                if (!callerJid) continue;
                
                try {
                    // First: attempt to reject the call if supported
                    try {
                        if (typeof dave.rejectCall === 'function' && call.id) {
                            await dave.rejectCall(call.id, callerJid);
                        } else if (typeof dave.sendCallOfferAck === 'function' && call.id) {
                            await dave.sendCallOfferAck(call.id, callerJid, 'reject');
                        }
                    } catch {}

                    // Notify the caller only once within a short window
                    if (!antiCallNotified.has(callerJid)) {
                        antiCallNotified.add(callerJid);
                        setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                        await dave.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                    }
                } catch {}
                
                // Then: block after a short delay to ensure rejection and message are processed
                setTimeout(async () => {
                    try { 
                        await dave.updateBlockStatus(callerJid, 'block'); 
                    } catch (e) {
                        console.error('Failed to block user:', e);
                    }
                }, 800);
            }
        } catch (e) {
            console.error('Error in anticall handler:', e);
        }
    });
    
    dave.ev.on('creds.update', saveCreds);
    
    dave.public = true;
    // This relies on smsg being loaded
    dave.serializeM = (m) => smsg(dave, m, store); 

    // --- ⚙️ BACKGROUND INTERVALS (Cleanup Logic) ---

    // 1. Session File Cleanup 
    setInterval(() => {
        try {
            const sessionPath = path.join(sessionDir);  
            if (!fs.existsSync(sessionPath)) return;
            fs.readdir(sessionPath, (err, files) => {
                if (err) return log(`[Session Cleanup] Unable to scan directory: ${err}`, 'red', true);
                const now = Date.now();
                const filteredArray = files.filter((item) => {
                    const filePath = path.join(sessionPath, item);
                    try {
                        const stats = fs.statSync(filePath);
                        return ((item.startsWith("pre-key") || item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")) &&
                            item !== 'creds.json' && now - stats.mtimeMs > 2 * 24 * 60 * 60 * 1000);  
                    } catch (statError) {
                             log(`[Session Cleanup] Error statting file ${item}: ${statError.message}`, 'red', true);
                             return false;
                    }
                });
                if (filteredArray.length > 0) {
                    log(`[Session Cleanup] Found ${filteredArray.length} old session files. Clearing...`, 'yellow');
                    filteredArray.forEach((file) => {
                        const filePath = path.join(sessionPath, file);
                        try { fs.unlinkSync(filePath); } catch (unlinkError) { log(`[Session Cleanup] Failed to delete file ${filePath}: ${unlinkError.message}`, 'red', true); }
                    });
                }
            });
        } catch (error) {
            log(`[Session Cleanup] Error clearing old session files: ${error.message}`, 'red', true);
        }
    }, 7200000); 

    // 2. Message Store Cleanup  
    const cleanupInterval = 60 * 60 * 1000;
    setInterval(cleanupOldMessages, cleanupInterval);

    // 3. Junk File Cleanup  
    const junkInterval = 30_000;
    setInterval(() => cleanupJunkFiles(dave), junkInterval); 

    return dave;
}

// --- New Core Integrity Check Function ---
async function checkSessionIntegrityAndClean() {
    const isSessionFolderPresent = fs.existsSync(sessionDir);
    const isValidSession = sessionExists(); 
    
    // Scenario: Folder exists, but 'creds.json' is missing (incomplete/junk session)
    if (isSessionFolderPresent && !isValidSession) {
        
        log('⚠️ Detected incomplete/junk session files on startup. Cleaning up before proceeding...', 'red');
        
        // 1. Delete the entire session folder (junk files, partial state, etc.)
        clearSessionFiles(); // Use the helper function
        
        // 2. Add the requested 3-second delay after cleanup
        log('Cleanup complete. Waiting 3 seconds for stability...', 'yellow');
        await delay(3000);
    }
}

// --- 🌟 NEW: .env File Watcher for Automated Restart ---
/**
 * Monitors the .env file for changes and forces a process restart.
 * Made mandatory to ensure SESSION_ID changes are always picked up.
 * @private 
 */
function checkEnvStatus() {
    try {
        log("╔══════════════════════════", 'magenta');
        log(`║ 👀 .env file watcher `, 'green');
        log("╚══════════════════════════", 'magenta');
        
        // Use persistent: false for better behavior in some hosting environments
        // Always set the watcher regardless of the environment
        fs.watch(envPath, { persistent: false }, (eventType, filename) => {
            if (filename && eventType === 'change') {
                log(chalk.bgRed.black('================================================='), 'white');
                log(chalk.white.bgRed('🚨 .env file change detected!'), 'white');
                log(chalk.white.bgRed('Forcing a clean restart to apply new configuration (e.g., SESSION_ID).'), 'white');
                log(chalk.red.bgBlack('================================================='), 'white');
                
                // Use process.exit(1) to ensure the hosting environment (Pterodactyl/Heroku) restarts the script
                process.exit(1);
            }
        });
    } catch (e) {
        log(`❌ Failed to set up .env file watcher (fs.watch error): ${e.message}`, 'red', true);
        // Do not exit, as the bot can still run, but notify the user
    }
}
// -------------------------------------------------------------

// --- Main login flow (DAVE MD) ---
async function tylor() {

    // 1. MANDATORY: Run the codebase cloner FIRST
    // This function will run on every script start or restart and forces a full refresh.
   // await downloadAndSetupCodebase();

    // *************************************************************
    // *** CRITICAL: REQUIRED FILES MUST BE LOADED AFTER CLONING ***
    // *************************************************************
    try {
        // We require settings BEFORE the env check to ensure the file is present
        // in case the cloning just happened.
        require('./settings')
        const mainModules = require('./main');
        const caseModules = require('./case');

        // Merge handlers if needed
        handleMessages = async (dave, chatUpdate, isCase) => {
            // First try main handler
            await mainModules.handleMessages(dave, chatUpdate, isCase);
            // Then try case handler if exists
            if (caseModules.handleMessages) {
                await caseModules.handleMessages(dave, chatUpdate, isCase);
            }
        };

        handleGroupParticipantUpdate = mainModules.handleGroupParticipantUpdate;
        handleStatus = mainModules.handleStatus;

        const myfuncModule = require('./lib/myfunc');
        smsg = myfuncModule.smsg;

        store = require('./lib/lightweight_store')
        store.readFromFile()
        settings = require('./settings')
        setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

        log("✨ Core files (main.js + case.js) loaded successfully.", 'green');
    } catch (e) { // ADDED: Missing catch block
        log(`FATAL: Failed to load core files after cloning. Check cloned repo structure. ${e.message}`, 'red', true);
        process.exit(1);
    }
    // *************************************************************

    // 2. NEW: Check the SESSION_ID format *before* connecting
    await checkAndHandleSessionFormat();

    // 3. Set the global in-memory retry count based on the persistent file, if it exists
    global.errorRetryCount = loadErrorCount().count;
    log(`Retrieved initial 408 retry count: ${global.errorRetryCount}`, 'yellow');

    // 4. *** IMPLEMENT USER'S PRIORITY LOGIC: Check .env SESSION_ID FIRST ***
    const envSessionID = process.env.SESSION_ID?.trim();

    if (envSessionID && envSessionID.startsWith('dave')) { 
        log("🔥 PRIORITY MODE: Found new/updated SESSION_ID in .env/environment variables.", 'magenta');

        // 4a. Force the use of the new session by cleaning any old persistent files.
        clearSessionFiles(); 

        // 4b. Set global and download the new session file (creds.json) from the .env value.
        global.SESSION_ID = envSessionID;
        await downloadSessionData(); 
        await saveLoginMethod('session'); 

        // 4c. Start bot with the newly created session files
        log("Valid session found (from .env), starting bot directly...", 'green');
        log('Waiting 3 seconds for stable connection...', 'yellow'); 
        await delay(3000);
        await startdave();

        // 4d. Start the file watcher
        checkEnvStatus(); // <--- START .env FILE WATCHER (Mandatory)

        return;
    }
    // If environment session is NOT set, or not valid, continue with fallback logic:
    log("ℹ️ No new SESSION_ID found in .env. Falling back to stored session or interactive login.", 'yellow');

    // 5. Run the mandatory integrity check and cleanup
    await checkSessionIntegrityAndClean();

    // 6. Check for a valid *stored* session after cleanup
    if (sessionExists()) {
        log("Valid session found, starting bot directly...", 'green'); 
        log('Waiting 3 seconds for stable connection...', 'yellow');
        await delay(3000);
        await startdave();

        // 6a. Start the file watcher
        checkEnvStatus(); // <--- START .env FILE WATCHER (Mandatory)

        return;
    }
      // 7. New Login Flow (If no valid session exists)
    const loginMethod = await getLoginMethod();
    let dave;

    if (loginMethod === 'session') {
        await downloadSessionData();
        // Socket is only created AFTER session data is saved
        dave = await startdave(); 
    } else if (loginMethod === 'number') {
        // Socket is created BEFORE pairing code is requested
        dave = await startdave();
        await requestPairingCode(dave); 
    } else {
        log("Failed to get valid login method. Exiting.", 'red');
        return;
    }

    // 8. Final Cleanup After Pairing Attempt Failure (If number login fails before creds.json is written)
    if (loginMethod === 'number' && !sessionExists() && fs.existsSync(sessionDir)) {
        log('Login interrupted/failed. Clearing temporary session files and restarting...', 'red');

        clearSessionFiles(); // Use the helper function

        // Force an exit to restart the entire login flow cleanly
        process.exit(1);
    }

    // 9. Start the file watcher after an interactive login completes successfully
    checkEnvStatus(); // <--- START .env FILE WATCHER (Mandatory)
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// -------------------- Web Server --------------------
app.use(express.static('public')); // serve static files from /public folder

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html'); // serve your index.html
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

// --- Start bot (DAVE MD) ---
tylor().catch(err => log(`Fatal error starting bot: ${err.message}`, 'red', true));
process.on('uncaughtException', (err) => log(`Uncaught Exception: ${err.message}`, 'red', true));
process.on('unhandledRejection', (err) => log(`Unhandled Rejection: ${err.message}`, 'red', true));