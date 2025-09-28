require('./setting/settings');
const makeWASocket = require("@whiskeysockets/baileys").default;
const { color } = require('./lib/color');
const NodeCache = require("node-cache");
const readline = require("readline");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const yargs = require('yargs/yargs');
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const axios = require('axios');
const express = require("express");
const _ = require('lodash');
const moment = require('moment-timezone');
const PhoneNumber = require('awesome-phonenumber');
const FileType = require('file-type'); // Added missing import
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, sleep, reSize } = require('./lib/myfunc');
const { getAggregateVotesInPollMessage, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadContentFromMessage, jidDecode } = require("@whiskeysockets/baileys");
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)
//------------------------------------------------------//
let phoneNumber = "254798570132"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "𝙳𝙰𝚅𝙴-𝙼𝙳"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Only create readline interface if we're in an interactive environment
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        // In non-interactive environment, use ownerNumber from settings
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// Helper function to normalize JID
function jidNormalizedUser(jid) {
    if (!jid) return jid;
    if (typeof jid !== 'string') return jid;
    return jid.split('@')[0] === '0' || jid.split('@')[0] === '62' ? 
        jid.split('@')[0].replace('0', '62') + '@s.whatsapp.net' : jid;
}

async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });

        if (!fs.existsSync(credsPath)) {
            if (!global.SESSION_ID) {
                console.log(color(`Session id not found at SESSION_ID!\nCreds.json not found at session folder!\n\nWait to enter your number`, 'red'));
                return false;
            }

            const base64Data = global.SESSION_ID.split("dave~")[1];
            if (!base64Data) {
                console.log(color('Invalid SESSION_ID format', 'red'));
                return false;
            }
            
            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            console.log(color(`Session successfully saved, please wait!!`, 'green'));
            return true;
        }
        return true;
    } catch (error) {
        console.error('Error downloading session data:', error);
        return false;
    }
}

async function startdave() {
    let { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    
    const msgRetryCounterCache = new NodeCache(); // for retry message, "waiting message"
    
    const dave = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // popping up QR in terminal log
        mobile: useMobile, // mobile api (prone to bans)
        browser: [ "Ubuntu", "Chrome", "20.0.04" ], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true, // set false for offline
        generateHighQualityLinkPreview: true, // make high preview link
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            let msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        },
        msgRetryCounterCache, // Resolve waiting messages
        defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
    });
   
    store.bind(dave.ev);

    // login use pairing code
    if (pairingCode && !dave.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api');

        let phoneNumber;
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber;
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 2547XXXXX (without + or spaces) : `)));
        }

        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

        const pn = PhoneNumber;
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 255792021944 for Tanzania, 254798570132 for Kenya, etc.) without + or spaces.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await dave.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)));
                console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`));
            } catch (error) {
                console.error('Error requesting pairing code:', error);
                console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'));
            }
        }, 3000);
    }
    
    store.bind(dave.ev);
    
    dave.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        try {
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                if (reason === DisconnectReason.badSession) {
                    console.log(`Bad Session File, Please Delete Session and Scan Again`);
                    startdave();
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log("Connection closed, reconnecting....");
                    startdave();
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log("Connection Lost from Server, reconnecting...");
                    startdave();
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                    startdave();
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
                    startdave();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log("Restart Required, Restarting...");
                    startdave();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log("Connection TimedOut, Reconnecting...");
                    startdave();
                } else {
                    console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
                    dave.end();
                }
            }
            
            if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
                console.log(color(`\nConnecting...`, 'white'));
            }

            if (update.connection == "open" || update.receivedPendingNotifications == "true") {
                console.log(color(` `,'magenta'));
                console.log(color(`Connected to => ` + JSON.stringify(dave.user, null, 2), 'green'));

                await delay(1999);

                try {
                    await dave.newsletterFollow("120363400480173280@newsletter");
                    console.log(color(`auto-followed your WhatsApp channel successfully!`, 'cyan'));
                } catch (e) {
                    console.log(color(`failed to follow channel: ${e}`, 'red'));
                }
                
                try {
                    await dave.groupAcceptInvite('LfTFxkUQ1H7Eg2D0vR3n6g');
                    console.log(color(`auto-joined a group`, 'cyan'));
                } catch (e) {
                    console.log(color(`failed to join group: ${e}`, 'yellow'));
                }

                const botNumber = dave.user.id.split(':')[0] + '@s.whatsapp.net';
                await dave.sendMessage(botNumber, { 
                    text: 
                    `
┏➤ *𝙳𝙰𝚅𝙴-𝙼𝙳 CONNECTED* ➤
┃➤ *Bot:* ${global.botname}
┃➤ *Time:* ${new Date().toLocaleString()}
┃➤ *Status:* Online
┃➤ *User:* ${dave.user.id.split(':')[0]}
┗➤────────────➤
`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: false,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363400480173280@newsletter',
                            newsletterName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃',
                            serverMessageId: -1
                        }
                    }
                });
                console.log(color('>DAVE-MD is Connected< [ ! ]','red'));
            }
        } catch (err) {
            console.log('Error in Connection.update '+err);
            startdave();
        }
    });
    
    const antiCallNotified = new Set();

    // Anticall handler: block callers when enabled
    dave.ev.on('call', async (calls) => { // Fixed: Changed XeonBotInc to dave
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
    
    //autostatus view
    dave.ev.on('messages.upsert', async (m) => {
    try {
        if (m.messages && m.messages[0] && m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
            await handleStatus(dave, m);
        }
    } catch (error) {
        console.error('Error in messages.upsert status handler:', error);
    }
});

dave.ev.on('status.update', async (status) => {
    try {
        await handleStatus(dave, status);
    } catch (error) {
        console.error('Error in status.update handler:', error);
    }
});

dave.ev.on('messages.reaction', async (reaction) => {
    try {
        await handleStatus(dave, reaction);
    } catch (error) {
        console.error('Error in messages.reaction handler:', error);
    }
});

    dave.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(dave, update);
    });
         

dave.ev.on('messages.upsert', async chatUpdate => {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;

        // Handle ephemeral messages
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') 
            ? mek.message.ephemeralMessage.message 
            : mek.message;

        // Ignore status broadcasts
        if (mek.key?.remoteJid === 'status@broadcast') {
            await handleStatus(dave, chatUpdate);
            return;
        }

        // Ignore messages that aren't meant for the bot
        if (!dave.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;
        if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return;

        // Prepare message object (like smsg)
        const m = smsg(dave, mek, store);

        // Determine if it's a command or mention
        const messageText = mek.message.conversation || 
                            mek.message.extendedTextMessage?.text || 
                            mek.message.imageMessage?.caption || '';

        const botPrefix = settings.prefix || '.';
        const isBotCommand = messageText.startsWith(botPrefix);
        const isBotMention = messageText.includes(`@${dave.user.id.split(':')[0]}`);

        // Exit early if not a command or mention
        if (!isBotCommand && !isBotMention && !mek.key.fromMe) return;

        // ✅ First: run davlo.js commands
        try {
            await require("./davlo")(dave, m, chatUpdate, store);
        } catch(err) {
            console.error("Error in davlo.js:", err);
            if (isBotCommand && mek.key?.remoteJid) {
                await dave.sendMessage(mek.key.remoteJid, { 
                    text: 'An error occurred while processing your message (davlo.js).',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: false,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363400480173280@newsletter',
                            newsletterName: '𝐃𝐀𝐕𝐄-𝐌𝐃',
                            serverMessageId: -1
                        }
                    }
                }).catch(console.error);
            }
        }

        // ✅ Second: run other commands (handleMessages)
        try {
            await handleMessages(dave, chatUpdate, true);
        } catch(err) {
            console.error("Error in handleMessages:", err);
            if (isBotCommand && mek.key?.remoteJid) {
                await dave.sendMessage(mek.key.remoteJid, { 
                    text: 'An error occurred while processing your message (handleMessages).',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: false,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363400480173280@newsletter',
                            newsletterName: '𝐃𝐀𝐕𝐄-𝐌𝐃',
                            serverMessageId: -1
                        }
                    }
                }).catch(console.error);
            }
        }

    } catch (err) {
        console.error("Error in messages.upsert:", err);
    }
});

    dave.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    }

    dave.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = dave.decodeJid(contact.id);
            if (store && store.contacts) {
                store.contacts[id] = {
                    id,
                    name: contact.notify
                };
            }
        }
    });

    dave.getName = (jid, withoutContact = false) => {
        let id = dave.decodeJid(jid);
        withoutContact = dave.withoutContact || withoutContact;
        let v;
        
        if (id.endsWith("@g.us")) {
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) v = await dave.groupMetadata(id) || {};
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
            });
        } else {
            v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === dave.decodeJid(dave.user.id) ? dave.user : (store.contacts[id] || {});
            
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || 
                   PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
        }
    }

    dave.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = [];
        for (let i of kon) {
            list.push({
                displayName: await dave.getName(i),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await dave.getName(i)}\nFN:${await dave.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
            });
        }
        dave.sendMessage(jid, { 
            contacts: { 
                displayName: `${list.length} Contact`, 
                contacts: list 
            }, 
            ...opts 
        }, { quoted });
    }

    dave.public = true;
    dave.serializeM = (m) => smsg(dave, m, store);

    dave.sendText = (jid, text, quoted = '', options) => dave.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    });

dave.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : 
                    /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : 
                    /^https?:\/\//.test(path) ? await (await getBuffer(path)) : 
                    fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        
        return await dave.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        });
    }

    dave.sendTextWithMentions = async (jid, text, quoted, options = {}) => dave.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    });

    dave.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : 
                  /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : 
                  /^https?:\/\//.test(path) ? await (await getBuffer(path)) : 
                  fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await imageToWebp(buff);
        }
        
        await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        .then(response => {
            fs.unlinkSync(buffer);
            return response;
        });
    }

    dave.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : 
                  /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : 
                  /^https?:\/\//.test(path) ? await (await getBuffer(path)) : 
                  fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }
        
        await dave.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        return buffer;
    }

    dave.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        
        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
        
        // save to file
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    }

    dave.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { 
        return dave.sendMessage(jid, { poll: { name, values, selectableCount }});
    }

    dave.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
    }
            
    dave.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        return buffer;
    }
    
    return dave;
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

// -------------------- Bot Startup --------------------
async function tylor() {
    try {
        if (fs.existsSync(credsPath)) {
            console.log(color("Session file found, starting bot...", 'yellow'));
            await startdave();        
        } else {
            const sessionDownloaded = await downloadSessionData();
            if (sessionDownloaded) {
                console.log("Session downloaded, starting bot.");
                await startdave();
            } else {
                if (!fs.existsSync(credsPath) && !global.SESSION_ID) {
                    console.log(color("Please wait for a few seconds to enter your number!", 'red'));
                    await startdave();
                }
            }
        }
    } catch (error) {
        console.error('Error starting bot:', error);
        process.exit(1);
    }
}

tylor();

// -------------------- Error Handling --------------------
process.on('uncaughtException', function (err) {
    let e = String(err);
    const ignored = [
        "conflict",
        "Socket connection timeout",
        "not-authorized",
        "already-exists",
        "rate-overlimit",
        "Connection Closed",
        "Timed Out",
        "Value not found"
    ];
    if (ignored.some(msg => e.includes(msg))) return;

    console.log('Caught exception: ', err);
});

// -------------------- Hot Reload --------------------
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});