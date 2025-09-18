require('./setting/settings');
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");
const axios = require('axios');
const didyoumean = require('didyoumean');
const path = require('path');
const chalk = require("chalk");
const util = require("util");
const cron = require('node-cron');
const os = require('os');
const {translate} = require('@vitalets/google-translate-api');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const googleTTS = require('google-tts-api');
const { randomBytes } = require('crypto');
const fg = require('api-dylux');
const yts = require('yt-search');
const gis = require('g-i-s');
const moment = require("moment-timezone");
const speed = require('performance-now');
const similarity = require('similarity');
const { spawn, exec, execSync } = require('child_process');

const { downloadContentFromMessage, proto, generateWAMessage, getContentType, prepareWAMessageMedia, generateWAMessageFromContent, GroupSettingChange, jidDecode, WAGroupMetadata, emitGroupParticipantsUpdate, emitGroupUpdate, generateMessageID, jidNormalizedUser, generateForwardMessageContent, WAGroupInviteMessageGroupMetadata, GroupMetadata, Headers, delay, WA_DEFAULT_EPHEMERAL, WADefault, getAggregateVotesInPollMessage, generateWAMessageContent, areJidsSameUser, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWaconnet, makeInMemoryStore, MediaType, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, initInMemoryKeyStore, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WAMediaUpload, mentionedJid, processTime, Browser, MessageType,
Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, DisconnectReason, WAconnet, getStream, WAProto, isBaileys, AnyMessageContent, templateMessage, InteractiveMessage, Header } = require("@whiskeysockets/baileys");

module.exports = dave = async (dave, m, chatUpdate, store) => {
try {
// Message type handlers
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
);

const sender = m.key.fromMe
? dave.user.id.split(":")[0] || dave.user.id
: m.key.participant || m.key.remoteJid;

const senderNumber = sender.split('@')[0];
const budy = (typeof m.text === 'string' ? m.text : '');
const prefa = ["", "!", ".", ",", "🐤", "🗿"];
const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi) : '/';

// Buat Grup
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");

// Database And Lain"
const botNumber = await dave.decodeJid(dave.user.id);
const isBot = botNumber.includes(senderNumber);
const newOwner = fs.readFileSync("./lib/owner.json")
const isOwner = newOwner.includes(m.sender);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
const args = body.trim().split(/ +/).slice(1);
const pushname = m.pushName || "No Name";
const text = q = args.join(" ");
const quoted = m.quoted ? m.quoted : m;
const mime = (quoted.msg || quoted).mimetype || '';
const qmsg = (quoted.msg || quoted);
const isMedia = /image|video|sticker|audio/.test(mime);

// function Group
const groupMetadata = isGroup ? await dave.groupMetadata(m.chat).catch((e) => {}) : "";
const groupOwner = isGroup ? groupMetadata.owner : "";
const groupName = m.isGroup ? groupMetadata.subject : "";
const participants = isGroup ? await groupMetadata.participants : "";
const groupAdmins = isGroup ? await participants.filter((v) => v.admin !== null).map((v) => v.id) : "";
const groupMembers = isGroup ? groupMetadata.participants : "";
const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;

// My Func
const { 
smsg, 
sendGmail, 
formatSize, 
isUrl, 
generateMessageTag, 
getBuffer, 
getSizeMedia, 
runtime, 
fetchJson, 
sleep } = require('./lib/myfunc');

// fungsi waktu real time
const time = moment.tz("Asia/Jakarta").format("HH:mm:ss");

// Cmd in Console
if (m.message) {
console.log('\x1b[30m--------------------\x1b[0m');
console.log(chalk.bgHex("#e74c3c").bold(`➤ New Messages`));
console.log(
chalk.bgHex("#00FF00").black(
` ⭔ Time: ${new Date().toLocaleString()} \n` +
` ⭔ Message: ${m.body || m.mtype} \n` +
` ⭔ Body: ${m.pushname} \n` +
` ⭔ JID: ${senderNumber}`
)
);
if (m.isGroup) {
console.log(
chalk.bgHex("#00FF00").black(
` ⭔ Grup: ${groupName} \n` +
` ⭔ GroupJid: ${m.chat}`
)
);
}
console.log();
} 


const qkontak = {
key: {
participant: `0@s.whatsapp.net`,
...(botNumber ? {
remoteJid: `status@broadcast`
} : {})
},
message: {
'contactMessage': {
'displayName': `${global.namaown}`,
'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=254756182478:+254756182478\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
sendEphemeral: true
}}
}

const reply = (teks) => {
dave.sendMessage(from, { text : teks }, { quoted : m })
}

const reaction = async (jidss, emoji) => {
dave.sendMessage(jidss, { react: { text: emoji, key: m.key }})}


if (global.autoTyping) {
  dave.sendPresenceUpdate("composing", from);
}

if (global.autoRecording) {
  dave.sendPresenceUpdate("recording", from);
}

dave.sendPresenceUpdate("unavailable", from);

if (global.autorecordtype) {
  let xeonRecordTypes = ["recording", "composing"];
  let selectedRecordType = xeonRecordTypes[Math.floor(Math.random() * xeonRecordTypes.length)];
  dave.sendPresenceUpdate(selectedRecordType, from);
}

if (autobio) {
  dave.updateProfileStatus(`𝙳𝙰𝚅𝙴-𝙼𝙳 𝙱𝙾𝚃 is Active| |Runtime ${runtime(process.uptime())}`)
    .catch(err => console.error("Error updating status:", err));
}

if (m.sender.startsWith("92") && global.anti92 === true) {
  return dave.updateBlockStatus(m.sender, "block");
}

if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(global.owner + "@s.whatsapp.net")) {
  if (!m.quoted) {
    reply("Owner is currently offline, please wait for a response");
    setTimeout(() => {
      dave.sendMessage(m.key.remoteJid, { delete: m.key });
    }, 2000);
  }
}


 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

        
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        case 'autotyping':
                if (!isBot) return reply(mess.owner)
        
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
        
                if (q === 'on') {

                    autoTyping = true

                    reply(`Successfully changed auto-typing to ${q}`)

                } else if (q === 'off') {

                    autoTyping = false

                    reply(`Successfully changed auto-typing to ${q}`)

                }

                break;
                
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        case 'autorecording':
                
                if (!isBot) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    autoRecording = true

                    reply(`Successfully changed auto-recording to ${q}`)

                } else if (q === 'off') {

                    autoRecording = false

                    reply(`Successfully changed auto-recording to ${q} `)

                }

                break;
                
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
      case 'define': 
if (!q) return m.reply(`What do you want to define?`)
try {
targetfine = await axios.get(`http://api.urbandictionary.com/v0/define?term=${q}`)
if (!targetfine) return reply(mess.error)
const reply = `
*${themeemoji} Word:* ${q}
*${themeemoji} Definition:* ${targetfine.data.list[0].definition
    .replace(/\[/g, "")
    .replace(/\]/g, "")}
*${themeemoji} Example:* ${targetfine.data.list[0].example
    .replace(/\[/g, "")
    .replace(/\]/g, "")}`
   dave.sendMessage(m.chat,{text:reply},{quoted:m})
} catch (err) {
    console.log(err)
    return m.reply(`*${q}* isn't a valid text`)
    }
    break    

 //======================================================\\ 

case "invite": case "linkgroup": { 
                 if (!m.isGroup) return reply(mess.group); 
                
                 let response = await dave.groupInviteCode(m.chat); 
                 dave.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nGroup link for  ${groupMetadata.subject}`, m, { detectLink: true }); 
             } 
          break;
//==================================================//

case "apk":
      case "app":{
          if (!text) return reply("Where is the app name?");
        let kyuu = await fetchJson (`https://bk9.fun/search/apk?q=${text}`);
        let tylor = await fetchJson (`https://bk9.fun/download/apk?id=${kyuu.BK9[0].id}`);
         await dave.sendMessage(
              m.chat,
              {
                document: { url: tylor.BK9.dllink },
                fileName: tylor.BK9.name,
                mimetype: "application/vnd.android.package-archive",
                contextInfo: {
        externalAdReply: {
          title: `𝙳𝙰𝚅𝙴-𝙼𝙳`,
          body: `${tylor.BK9.name}`,
          thumbnailUrl: `${tylor.BK9.icon}`,
          sourceUrl: `${tylor.BK9.dllink}`,
          mediaType: 2,
          showAdAttribution: true,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });
          }
      break;

//==================================================//

case "pong":
case "speed": {
  try {
    // Send initial message
    let sent = await dave.sendMessage(m.chat, { text: "Checking speed." }, { quoted: m });

    // Measure real response time
    const start = performance.now();

    // Animate loading dots
    for (let i = 0; i < 3; i++) {
      await sleep(500);
      await dave.sendMessage(m.chat, {
        text: "Checking speed" + ".".repeat((i + 1) % 4),
        edit: sent.key
      });
    }

    const end = performance.now();
    const speed = (end - start).toFixed(2);

    // Edit message with final result
    await dave.sendMessage(m.chat, {
      text: `Pong\nResponse Speed: ${speed} ms`,
      edit: sent.key
    });

  } catch (e) {
    console.error("Speed command error:", e);
    await dave.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m });
  }
}
break;
//==================================================//


case 'botpp': { 
    if (!Owner) throw NotOwner; 
    if (!quoted) throw `Tag an image you want to be the bot's profile picture with ${prefix + command}`; 
    if (!/image/.test(mime)) throw `Tag an image you want to be the bot's profile picture with ${prefix + command}`; 
    if (/webp/.test(mime)) throw `Tag an image you want to be the bot's profile picture with ${prefix + command}`; 
    let media = await dave.downloadAndSaveMediaMessage(quoted);
		
                    await dave.updateProfilePicture(botNumber, { url: media }).catch((err) => fs.unlinkSync(media)); 
    reply `Bot's profile picture has been successfully updated!`; 
	  }
    break;

//==================================================//

case "setvar": 
 if (!Owner) throw NotOwner;  
 if(!text.split('=')[1]) return reply('Incorrect Usage:\nProvide the key and value correctly\nExample: setvar AUTOVIEW_STATUS=TRUE')  
 const herok = new Heroku({  
            token: herokuapi,  
          });  
          let baseURI = "/apps/" + appname;  
 await herok.patch(baseURI + "/config-vars", {  
            body: {  
                    [text.split('=')[0]]: text.split('=')[1],  
            },  
 });  
          await reply(`The variable ${text.split('=')[0]} = ${text.split('=')[1]} has been set Successfuly.\nWait 20s for changes to effect!`);  
  
 break;
		      
//========================================================================================================================//	
		      case "dlt": case "dil": { 
 if (!m.quoted) throw `No message quoted for deletion`; 
 let { chat, fromMe, id, isBaileys } = m.quoted; 
 if (isBaileys) throw `I cannot delete. Quoted message is my message or another bot message.`; 
 dave.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } }); 
 } 
 break;
//========================================================================================================================//


case "gpass":
case "genpassword": {
  try {
    const length = args[0] ? parseInt(args[0]) : 12;
    if (isNaN(length) || length < 8) {
      return m.reply("⚠️ Enter a valid password length (minimum 8 characters).");
    }

    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    m.reply(`🔑 *Generated Password (${length} characters)*\n\n\`\`\`${password}\`\`\``);
  } catch (e) {
    console.error(e);
    m.reply(`❌ Error generating password: ${e.message}`);
  }
}
break;

//==================================================//
case "gpt4": {
    if (!text) return reply("Hello there, what's your question?");
    try {
        const d = await fetchJson(`https://bk9.fun/ai/Aoyo?q=${text}`);
        if (!d.BK9) {
            return reply("An error occurred while fetching the AI chatbot response. Please try again later.");
        }
        reply(d.BK9);
    } catch (e) {
        console.error(e);
        reply("Something went wrong while contacting the AI. Please try again.");
    }
}
break;
//==================================================//


case "inspect": {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');

    if (!text) return m.reply("Provide a valid web link to fetch! The bot will crawl the website and fetch its HTML, CSS, JavaScript, and any media embedded in it.");

    if (!/^https?:\/\//i.test(text)) {
        return m.reply("Please provide a URL starting with http:// or https://");
    }

    try {
        const response = await fetch(text);
        const html = await response.text();
        const $ = cheerio.load(html);

        const mediaFiles = [];
        $('img[src], video[src], audio[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                mediaFiles.push(src);
            }
        });

        const cssFiles = [];
        $('link[rel="stylesheet"]').each((i, element) => {
            let href = $(element).attr('href');
            if (href) {
                cssFiles.push(href);
            }
        });

        const jsFiles = [];
        $('script[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                jsFiles.push(src);
            }
        });

        await m.reply(`**Full HTML Content**:\n\n${html}`);

        if (cssFiles.length > 0) {
            for (const cssFile of cssFiles) {
                const cssResponse = await fetch(new URL(cssFile, text));
                const cssContent = await cssResponse.text();
                await m.reply(`**CSS File Content**:\n\n${cssContent}`);
            }
        } else {
            await m.reply("No external CSS files found.");
        }

        if (jsFiles.length > 0) {
            for (const jsFile of jsFiles) {
                const jsResponse = await fetch(new URL(jsFile, text));
                const jsContent = await jsResponse.text();
                await m.reply(`**JavaScript File Content**:\n\n${jsContent}`);
            }
        } else {
            await m.reply("No external JavaScript files found.");
        }

        if (mediaFiles.length > 0) {
            await m.reply(`**Media Files Found**:\n${mediaFiles.join('\n')}`);
        } else {
            await m.reply("No media files (images, videos, audios) found.");
        }

    } catch (error) {
        console.error(error);
        return m.reply("An error occurred while fetching the website content.");
    }
}
break;

//==================================================//

case 'approve': case 'approve-all': {
    if (!m.isGroup) throw group;
    if (!isAdmin) throw admin;
    if (!isBotAdmin) throw botAdmin;

    const responseList = await dave.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) return m.reply("No pending join requests at the moment.");

    for (const participant of responseList) {
        await dave.groupRequestParticipantsUpdate(
            m.chat,
            [participant.jid],
            "approve"
        );
    }
    m.reply("Pending participants have been approved successfully.");
}
break;

//========================================================================================================================//


case "close": case "mutegc": { 
  
                 if (!m.isGroup) throw group; 
                 if (!isBotAdmin) throw botAdmin; 
                 if (!isAdmin) throw admin; 
  
                     await dave.groupSettingUpdate(m.chat, 'announcement'); 
 m.reply('Group successfully locked!'); 
 } 
 break; 

//========================================================================================================================//		      
 case "open": case "unmutegc": { 
                 if (!m.isGroup) throw group; 
                 if (!isBotAdmin) throw botAdmin; 
                 if (!isAdmin) throw admin; 
  
                     await dave.groupSettingUpdate(m.chat, 'not_announcement'); 
 m.reply('Group successfully unlocked!'); 
  
 }
        break; 

//========================================================================================================================//

case 'reject': case 'reject-all': {
    if (!m.isGroup) throw group;
    if (!isAdmin) throw admin;
    if (!isBotAdmin) throw botAdmin;

    const responseList = await dave.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) return m.reply("No pending join requests at the moment.");

    for (const participant of responseList) {
        await dave.groupRequestParticipantsUpdate(
            m.chat,
            [participant.jid],
            "reject"
        );
    }
    m.reply("Pending participants have been rejected successfully.");
}
break;

//========================================================================================================================//
case "admin": {
    if (!m.isGroup) throw group;
    if (!isBotAdmin) throw botAdmin;
    if (!Owner) throw NotOwner;

    await dave.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    m.reply("You have been promoted to admin.");
}
break;

//========================================================================================================================//
case "getvar": {
    if (!Owner) throw NotOwner;

    const heroku = new Heroku({
        token: herokuapi, // Replace with your actual Heroku token
    });

    const baseUR = "/apps/" + appname;
    const h9 = await heroku.get(baseUR + '/config-vars');

    let stoy = 'Below are Heroku variables for the bot:\n\n';
    for (const vrt in h9) {
        stoy += `${vrt}=${h9[vrt]}\n\n`;
    }

    m.reply(stoy);
}
break;

//==================================================//

case 'closetime':
                if (!m.isGroup) return m.reply(mess.group)
                if (!isAdmins && !Owner) return reply(mess.admin)
                if (!isBotAdmins) return m.reply(mess.admin)
                if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return m.reply('*select:*\nsecond\nminute\nhour\n\n*Example*\n10 second')
                }
                m.reply(`Close time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = m.participant
                    const close = `*Close time* group closed by admin\nnow only admin can send messages`
                    dave.groupSettingUpdate(m.chat, 'announcement')
                    
                  m.reply(close)
                }, timer)
                break
//========================================================\\
case 'opentime':
                if (!m.isGroup) return m.reply(mess.group)
                if (!isAdmins && !Owner) return reply(mess.admin)
                if (!isBotAdmins) return m.reply(mess.admin)
                if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return m.reply('*select:*\nsecond\nminute\nhour\n\n*example*\n10 second')
                }
                m.reply(`Open time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = m.participant
                    const open = `*Open time* the group was opened by admin\n now members can send messages`
                   dave.groupSettingUpdate(m.chat, 'not_announcement')
                    m.reply(open)
                }, timer)
                break
//========================================================\\

//==================================================//

 case 'pin': case 'unpin': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!isAdmins) return m.reply(mess.admin)
				if (!isBotAdmins) return m.reply(`bot must be admin first`)
				await dave.sendMessage(m.chat, { pin: { type: command == 'pin' ? 1 : 0, time: 2592000, key: m.quoted ? m.quoted.key : m.key }})
			}
			break
//==================================================//

case "pinterest": case "pinn": {
    if (!text) return m.reply('Provide a valid Pinterest link.');

    if (!text.includes("pin.it")) {
        return m.reply("That is not a Pinterest link.");
    }

    await dave.sendMessage(m.chat, {
        react: { text: 'OK', key: m.key }
    });

    try {
        const pinterestUrl = text;
        const response = await axios.get(`https://api.bk9.dev/download/pinterest?url=${encodeURIComponent(pinterestUrl)}`);

        if (!response.data.status) {
            return m.reply('Unable to fetch Pinterest data.');
        }

        const media = response.data.BK9;
        const caption = `Downloaded by DAVE-MD`;

        if (media.length > 0) {
            const videoUrl = media.find(item => item.url.includes('.mp4'))?.url;
            const imageUrl = media.find(item => item.url.includes('.jpg'))?.url;

            if (videoUrl) {
                await dave.sendMessage(m.chat, { video: { url: videoUrl }, caption: caption }, { quoted: m });
            } else if (imageUrl) {
                await dave.sendMessage(m.chat, { image: { url: imageUrl }, caption: caption }, { quoted: m });
            } else {
                m.reply('No media found.');
            }
        } else {
            m.reply('No media found.');
        }
    } catch (error) {
        console.error(error);
        m.reply('An error occurred while processing your request.');
    }
}
break;

//==================================================//

case 'onlygroup':
            case 'onlygc':
                if (!Owner) return m.reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q == 'on') {
                    db.data.settings[botNumber].onlygrub = true
                    m.reply(`Successfully Changed Onlygroup To ${q}`)
                } else if (q == 'off') {
                    db.data.settings[botNumber].onlygrub = false
                    m.reply(`Successfully Changed Onlygroup To ${q}`)
                }
            break
//========================================================\\
case 'onlyprivatechat':
            case 'onlypc':
                if (!Owner) return m.reply(mess.owner)
                if (args.length < 1) return m.reply(`Example ${prefix + command} on/off`)
                if (q == 'on') {
                    db.data.settings[botNumber].onlypc = true
                    m.reply(`Successfully Changed Only-Pc To ${q}`)
                } else if (q == 'off') {
                    db.data.settings[botNumber].onlypc = false
                    m.reply(`Successfully Changed Only-Pc To ${q}`)
                }
            break
//========================================================\\
case "setppgc": {
if (!isGroup) return m.reply(mess.group)
if (!isBotAdmins) return m.reply(mess.adminbot)
if (!isBotAdmins) return m.reply(mess.admin)
if (/image/g.test(mime)) {
let media = await dave.downloadAndSaveMediaMessage(qmsg)
await dave.updateProfilePicture(m.chat, {url: media})
await fs.unlinkSync(media)
m.reply("Group profile photo changed successfully by 𝙳𝙰𝚅𝙴-𝙼𝙳")
} else return m.reply('tag/reply foto')}
break
//========================================================\\
case "setppbot":
case "setpp": {
    if (!Owner) return m.reply(mess.owner);
    if (!m.quoted) return m.reply("⚠️ Please reply to an image.");
    if (!/image/.test(mime)) return m.reply("⚠️ This is not an image.");

    try {
        // Download image
        const mediaPath = await dave.downloadAndSaveMediaMessage(m.quoted);

        // Convert image to correct format for profile picture
        const { img } = await generateProfilePicture(mediaPath);

        // Update bot profile picture
        await dave.updateProfilePicture(botNumber, img);

        // Delete temp file
        fs.unlinkSync(mediaPath);

        // Confirmation message
        m.reply("✅ 𝙳𝙰𝚅𝙴-𝙼𝙳 profile picture has been updated successfully!");
    } catch (err) {
        console.error("SetPP Error:", err);
        m.reply("❌ Failed to update profile picture.\nError: " + err.message);
    }
}
break;

 case "dp": { 
 try { 
 ha = m.quoted.sender; 
 qd = await dave.getName(ha); 
 pp2 = await dave.profilePictureUrl(ha,'image'); 
 } catch {  
 pp2 = 'https://tinyurl.com/yx93l6da'; 
 } 
  if (!m.quoted) throw `Tag a user!`; 
 bar = `Profile Picture of ${qd}`; 
 dave.sendMessage(m.chat, { image: { url: pp2}, caption: bar, fileLength: "999999999999"}, { quoted: m}); 
 } 
 break;

//========================================================================================================================//		      
case "getsettings": case "vars": case "set":
let vaa = `𝟏 Owner➣ 𝙳𝙰𝚅𝙴-𝙼𝙳 𝐜𝐨𝐧𝐭𝐚𝐜𝐭\n\n𝟐 𝐁𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭➣ 𝐒𝐞𝐧𝐝𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨 𝐚𝐥𝐥 𝐠𝐫𝐨𝐮𝐩𝐬\n\n𝟑 𝐉𝐨𝐢𝐧➣ 𝐭𝐚𝐠 𝐠𝐫𝐨𝐮𝐩 𝐥𝐢𝐧𝐤 𝐰𝐢𝐭𝐡 𝐣𝐨𝐢𝐧\n\n𝟒 𝐛𝐨𝐭𝐩𝐩➣ 𝐂𝐡𝐚𝐧𝐠𝐞 𝐛𝐨𝐭𝐬 𝐚𝐜𝐜𝐨𝐮𝐧𝐭 𝐝𝐩\n\n𝟓 𝐁𝐥𝐨𝐜𝐤➣ 𝐁𝐥𝐨𝐜𝐤 𝐭𝐡𝐞𝐦 𝐟𝐚𝐤𝐞 𝐟𝐫𝐢𝐞𝐧𝐝𝐬\n\n𝟔 𝐊𝐢𝐥𝐥➣ 𝐊𝐢𝐥𝐥𝐬 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧 𝐬𝐞𝐜𝐨𝐧𝐝𝐬\n\n𝟕 𝐔𝐧𝐛𝐥𝐨𝐜𝐤➣ 𝐆𝐢𝐯𝐞 𝐭𝐡𝐞𝐦 𝐟𝐚𝐤𝐞 𝐟𝐫𝐢𝐞𝐧𝐝𝐬 𝐚 𝐬𝐞𝐜𝐨𝐧𝐝 𝐜𝐡𝐚𝐧𝐜𝐞\n\n𝟖 𝐒𝐞𝐭𝐯𝐚𝐫➣ 𝐒𝐞𝐭 𝐯𝐚𝐫𝐬 𝐢𝐧 𝐡𝐞𝐫𝐨𝐤𝐮\n\n𝟗 𝐒𝐭𝐢𝐜𝐤𝐞𝐫➣ 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐬 𝐚 𝐩𝐡𝐨𝐭𝐨 𝐨𝐫 𝐚 𝐬𝐡𝐨𝐫𝐭 𝐯𝐢𝐝𝐞𝐨 𝐭𝐨 𝐚 𝐬𝐭𝐢𝐜𝐤𝐞𝐫\n\n𝟏𝟎 𝐓𝐨𝐢𝐦𝐠➣ 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐬 𝐚 𝐬𝐭𝐢𝐜𝐤𝐞𝐫 𝐭𝐨 𝐚 𝐩𝐡𝐨𝐭𝐨\n\n𝟏𝟏 𝐏𝐥𝐚𝐲➣ 𝐆𝐞𝐭 𝐲𝐨𝐮𝐫 𝐟𝐚𝐯𝐨𝐫𝐢𝐭𝐞 𝐬𝐨𝐧𝐠\n\n𝟏𝟐 𝐖𝐡𝐚𝐭𝐬𝐨𝐧𝐠➣ 𝐠𝐞𝐭 𝐭𝐡𝐞 𝐭𝐢𝐭𝐥𝐞 𝐨𝐟 𝐭𝐡𝐞 𝐬𝐨𝐧𝐠\n\n𝟏𝟑 𝐘𝐭𝐬 ➣ 𝐆𝐞𝐭 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐯𝐢𝐝𝐞𝐨𝐬\n\n𝟏𝟒 𝐌𝐨𝐯𝐢𝐞➣ 𝐆𝐞𝐭 𝐲𝐨𝐮𝐫 𝐟𝐚𝐯𝐨𝐫𝐢𝐭𝐞 𝐦𝐨𝐯𝐢𝐞 𝐝𝐞𝐭𝐚𝐢𝐥𝐬\n\n𝟏𝟓 𝐌𝐢𝐱➣ 𝐂𝐨𝐦𝐛𝐢𝐧𝐞𝐬 +𝟐𝐞𝐦𝐨𝐣𝐢𝐬\n\n𝟏𝟔 𝐀𝐢-𝐢𝐦𝐠➣ 𝐆𝐞𝐭 𝐚𝐧 𝐀𝐢 𝐩𝐡𝐨𝐭𝐨\n\n𝟏𝟕 𝐆𝐩𝐭 ➣ 𝐇𝐞𝐫𝐞 𝐭𝐨 𝐚𝐧𝐬𝐰𝐞𝐫 𝐲𝐨𝐮𝐫 𝐪𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬\n\n𝟏𝟖 𝐃𝐩➣ 𝐆𝐞𝐭𝐬 𝐚 𝐩𝐞𝐫𝐬𝐨𝐧 𝐝𝐩\n\n𝟏𝟗 𝐒𝐩𝐞𝐞𝐝 ➣ 𝐂𝐡𝐞𝐜𝐤𝐬 𝐛𝐨𝐭𝐬 𝐬𝐩𝐞𝐞𝐝\n\n𝟐𝟎 𝐀𝐥𝐢𝐯𝐞➣ 𝐂𝐡𝐞𝐜𝐤 𝐰𝐡𝐞𝐭𝐡𝐞𝐫 𝐭𝐡𝐞 𝐛𝐨𝐭 𝐢𝐬 𝐬𝐭𝐢𝐥𝐥 𝐤𝐢𝐜𝐤𝐢𝐧𝐠\n\n𝟐𝟏 𝐑𝐮𝐧𝐭𝐢𝐦𝐞➣ 𝐖𝐡𝐞𝐧 𝐝𝐢𝐝 𝐛𝐨𝐭 𝐬𝐭𝐚𝐫𝐭𝐞𝐝 𝐨𝐩𝐞𝐫𝐚𝐭𝐢𝐧𝐠\n\n𝟐𝟐 𝐒𝐜𝐫𝐢𝐩𝐭➣ 𝐆𝐞𝐭 𝐛𝐨𝐭 𝐬𝐜𝐫𝐢𝐩𝐭\n\n𝟐𝟑 𝐎𝐰𝐧𝐞𝐫  ➣ 𝐆𝐞𝐭 𝐨𝐰𝐧𝐞𝐫(𝐬) 𝐜𝐨𝐧𝐭𝐚𝐜𝐭\n\n𝟐𝟒 𝐕𝐚𝐫𝐬 ➣ 𝐒𝐞𝐞 𝐚𝐥𝐥 𝐯𝐚𝐫𝐢𝐚𝐛𝐥𝐞𝐬\n\n𝟐𝟓 𝐏𝐫𝐨𝐦𝐨𝐭𝐞➣ 𝐆𝐢𝐯𝐞𝐬 𝐨𝐧𝐞 𝐚𝐝𝐦𝐢𝐧 𝐫𝐨𝐥𝐞\n\n𝟐𝟔 𝐃𝐞𝐦𝐨𝐭𝐞➣ 𝐃𝐞𝐦𝐨𝐭𝐞𝐬 𝐟𝐫𝐨𝐦 𝐠𝐫𝐨𝐮𝐩 𝐚𝐝𝐦𝐢𝐧 𝐭𝐨 𝐚 𝐦𝐞𝐦𝐛𝐞𝐫\n\n𝟐𝟕 𝐃𝐞𝐥𝐞𝐭𝐞➣ 𝐃𝐞𝐥𝐞𝐭𝐞 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞\n\n𝟐𝟖 𝐑𝐞𝐦𝐨𝐯𝐞/𝐤𝐢𝐜𝐤➣ 𝐊𝐢𝐜𝐤 𝐭𝐡𝐚𝐭 𝐭𝐞𝐫𝐫𝐨𝐫𝐢𝐬𝐭 𝐟𝐫𝐨𝐦 𝐚 𝐠𝐫𝐨𝐮𝐩\n\n𝟐𝟗 𝐅𝐨𝐫𝐞𝐢𝐠𝐧𝐞𝐫𝐬➣ 𝐆𝐞𝐭 𝐟𝐨𝐫𝐞𝐢𝐠𝐧 𝐧𝐮𝐦𝐛𝐞𝐫𝐬\n\n𝟑𝟎 𝐂𝐥𝐨𝐬𝐞➣ 𝐓𝐢𝐦𝐞 𝐟𝐨𝐫 𝐠𝐫𝐨𝐮𝐩 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐭𝐨 𝐭𝐚𝐤𝐞 𝐚 𝐛𝐫𝐞𝐚𝐤 𝐨𝐧𝐥𝐲 𝐚𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐜𝐡𝐚𝐭\n\n𝟑𝟏 𝐎𝐩𝐞𝐧 ➣ 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞 𝐜𝐚𝐧 𝐜𝐡𝐚𝐭 𝐢𝐧 𝐚 𝐠𝐫𝐨𝐮𝐩\n\n𝟑𝟐 𝐈𝐜𝐨𝐧➣ 𝐂𝐡𝐚𝐧𝐠𝐞 𝐠𝐫𝐨𝐮𝐩 𝐢𝐜𝐨𝐧\n\n𝟑𝟑 𝐒𝐮𝐛𝐣𝐞𝐜𝐭➣ 𝐂𝐡𝐚𝐧𝐠𝐞 𝐠𝐫𝐨𝐮𝐩 𝐬𝐮𝐛𝐣𝐞𝐜𝐭\n\n𝟑𝟒 𝐃𝐞𝐬𝐜➣ 𝐆𝐞𝐭 𝐠𝐫𝐨𝐮𝐩 𝐝𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧\n\n𝟑𝟓 𝐋𝐞𝐚𝐯𝐞➣ 𝐓𝐡𝐞 𝐠𝐫𝐨𝐮𝐩 𝐢𝐬 𝐛𝐨𝐫𝐢𝐧𝐠 ,𝐭𝐢𝐦𝐞 𝐟𝐨𝐫 𝐛𝐨𝐭 𝐭𝐨 𝐥𝐞𝐚𝐯𝐞\n\n𝟑𝟔 𝐓𝐚𝐠𝐚𝐥𝐥 ➣ 𝐓𝐚𝐠 𝐞𝐯𝐞𝐫𝐲𝐨𝐧𝐞 𝐢𝐧 𝐚 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭\n\n𝟑𝟕 𝐇𝐢𝐝𝐞𝐭𝐚𝐠➣ 𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧! 𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧! 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐡𝐚𝐬 𝐬𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐭𝐨 𝐬𝐚𝐲\n\n𝟑𝟖 𝐑𝐞𝐯𝐨𝐤𝐞 ➣ 𝐑𝐞𝐬𝐞𝐭 𝐠𝐫𝐨𝐮𝐩 𝐥𝐢𝐧𝐤`
reply(vaa)
break;

//========================================================================================================================//		      
  case "....": case "mmmm":{

if (!m.quoted) return m.reply("quote a viewonce message eh")

  const quotedMessage = m.msg?.contextInfo?.quotedMessage;

    if (quotedMessage.imageMessage) {
      let imageCaption = quotedMessage.imageMessage.caption;
      let imageUrl = await dave.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
      dave.sendMessage(m.chat, { image: { url: imageUrl }, caption: `Retrieved b!\n${imageCaption}`}, { quoted: m });
    }

    if (quotedMessage.videoMessage) {
      let videoCaption = quotedMessage.videoMessage.caption;
      let videoUrl = await dave.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
      dave.sendMessage(m.chat, { video: { url: videoUrl }, caption: `Retrieved by 𝙳𝙰𝚅𝙴-𝙼𝙳!\n${videoCaption}`}, { quoted: m });
    }
      }
	break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'joke': {
try {
        const url = 'https://official-joke-api.appspot.com/random_joke';  // API for random jokes
        const response = await axios.get(url);
        const joke = response.data;
        const jokeMessage = `
😂 *Below is a random joke for you* 😂\n\n
*${joke.setup}*\n\n
${joke.punchline} 😄
`;
        return reply(jokeMessage);
    } catch (e) {
        console.log(e);
        return reply("Couldn't fetch a joke right now. Please try again later.");
    }
}
break;

//==================================================//

case 'carbon': {
  const fetch = require('node-fetch');
  let cap = `𝙳𝙰𝚅𝙴-𝙼𝙳 is on fire 🔥`;

  if (m.quoted && m.quoted.text) {
    const forq = m.quoted.text;
    try {
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: forq,
          backgroundColor: '#1F816D',
        }),
      });

      if (!response.ok) return m.reply('API failed to fetch a valid response.');

      let per = await response.buffer();
      await dave.sendMessage(m.chat, { image: per, caption: cap }, { quoted: m });
    } catch (error) {
      m.reply("An error occured\n" + error);
    }
  } else {
    m.reply('Quote a code message');
  }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'zodiac': {
  if (!text) return reply('Please provide your birth month and date\n*Example:* zodiac 8 23 (for August 23)');
  const input = text.split(' ');
  if (input.length !== 2 || isNaN(input[0]) || isNaN(input[1])) return reply('Incorrect format. Use: month day (e.g. zodiac 5 15 for May 15)');

  const month = parseInt(input[0]);
  const day = parseInt(input[1]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return reply('Invalid date. Please check your month (1-12) and day (1-31)');

  let zodiacSign = '';
  let traits = '';
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) { zodiacSign = 'Aries'; traits = 'Adventurous, energetic, courageous, enthusiastic, confident, dynamic, quick-witted'; }
  else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) { zodiacSign = 'Taurus'; traits = 'Patient, reliable, warmhearted, loving, persistent, determined, placid, security loving'; }
  else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) { zodiacSign = 'Gemini'; traits = 'Adaptable, versatile, communicative, witty, intellectual, eloquent, youthful, lively'; }
  else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) { zodiacSign = 'Cancer'; traits = 'Emotional, loving, intuitive, imaginative, shrewd, cautious, protective, sympathetic'; }
  else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) { zodiacSign = 'Leo'; traits = 'Generous, warmhearted, creative, enthusiastic, broad-minded, expansive, faithful, loving'; }
  else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) { zodiacSign = 'Virgo'; traits = 'Modest, shy, meticulous, reliable, practical, diligent, intelligent, analytical'; }
  else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) { zodiacSign = 'Libra'; traits = 'Diplomatic, urbane, romantic, charming, easygoing, sociable, idealistic, peaceable'; }
  else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) { zodiacSign = 'Scorpio'; traits = 'Determined, forceful, emotional, intuitive, powerful, passionate, exciting, magnetic'; }
  else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) { zodiacSign = 'Sagittarius'; traits = 'Optimistic, freedom-loving, jovial, good-humored, honest, straightforward, intellectual'; }
  else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) { zodiacSign = 'Capricorn'; traits = 'Practical, prudent, ambitious, disciplined, patient, careful, humorous, reserved'; }
  else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) { zodiacSign = 'Aquarius'; traits = 'Friendly, humanitarian, honest, loyal, original, inventive, independent, intellectual'; }
  else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) { zodiacSign = 'Pisces'; traits = 'Imaginative, sensitive, compassionate, kind, selfless, unworldly, intuitive, sympathetic'; }
  else return reply('Could not determine zodiac sign. Please check your birth date.');

  const msg = `*Zodiac Sign*\n\n*Birth Date:* ${month}/${day}\n*Sign:* ${zodiacSign}\n*Traits:* ${traits}\n\n_Requested by ${pushname}_`;
  dave.sendMessage(m.chat, { text: msg }, { quoted: m });
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "tweet": {
  if (!text) return m.reply("Provide some text for the tweet");
  const displayname = pushname;
  const username = m.sender.split('@')[0];
  const avatar = await dave.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.imgur.com/vuxJCTB.jpeg');
  const imageurl = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayname)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(text)}&replies=246&retweets=125&theme=dark`;
  await dave.sendMessage(m.chat, { image: { url: imageurl }, caption: `𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗲𝗱 𝗯𝘆 𝙳𝙰𝚅𝙴-𝙼𝙳` }, { quoted: m });
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "pickupline": {
  try {
    const response = await fetch('https://api.popcat.xyz/pickuplines');
    if (!response.ok) throw new Error('Failed to fetch data');
    const { pickupline } = await response.json();
    await dave.sendMessage(m.chat, { text: pickupline }, { quoted: m });
  } catch (error) {
    console.error('Error fetching data:', error);
    await dave.sendMessage(m.chat, { text: 'An error occurred while fetching the fact.' }, { quoted: m });
  }
}
break;


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
                    
   //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//	     
                          
      case 'lemonmail': case 'sendemail': {
 const args = text.split('|'); if (args.length < 3) return m.reply('Format wrong! Provide: email|subject|message');
const [target, subject, message] = args;
        m.reply('sending email...');
        try {
            const data = JSON.stringify({ "to": target.trim(), "subject": subject.trim(), "message": message.trim() });
            const config = {
                method: 'POST',
                url: 'https://lemon-email.vercel.app/send-email',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
                    'Content-Type': 'application/json',
                    'sec-ch-ua-platform': '"Android"',
                    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                    'sec-ch-ua-mobile': '?1',
                    'origin': 'https://lemon-email.vercel.app',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://lemon-email.vercel.app/',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                data: data
            };
            const axios = require('axios');
            const api = await axios.request(config);
            m.reply(`Email: ${JSON.stringify(api.data, null, 2)}`);
        } catch (error) {
            m.reply(`Error: ${error.message}`);
        }
        }
        break
  //======================================================\\  
                 
case 'myip':
            case 'ipbot':
                if (!Owner) return m.reply(mess.owner)
                var http = require('http')
                http.get({
                    'host': 'api.ipify.org',
                    'port': 80,
                    'path': '/'
                }, function(resp) {
                    resp.on('data', function(ip) {
                        reply("🔎 My public IP address is: " + ip);
                    })
                })
            break
            
       //========================================================\\     
       
       
       case "ff":
case "ffstalk":{
 try {
 if (args.length === 0) return m.reply(`Example: ${prefix + command} 537212033`);
 
 const id = args[0];
 const apiUrl = `https://vapis.my.id/api/ff-stalk?id=${id}`;
 
 const response = await fetch(apiUrl);
 const json = await response.json();
 
 if (!json.status) return m.reply('Failed to fetch data. User ID might be invalid.');
 
 const data = json.data;
 const account = data.account;
 const pet = data.pet_info;
 const guild = data.guild;
 const items = data.equippedItems;
 
 let text = `*👤 FREE FIRE USER INFO*\n\n`;
 text += `*🆔 User ID*: ${account.id}\n`;
 text += `*👤 Username*: ${account.name}\n`;
 text += `*🔰 Level*: ${account.level}\n`;
 text += `*⭐ XP*: ${account.xp}\n`;
 text += `*🌍 Region*: ${account.region}\n`;
 text += `*👍 Likes*: ${account.like}\n`;
 text += `*📝 Bio*: ${account.bio}\n`;
 text += `*🎂 Created*: ${account.create_time}\n`;
 text += `*⏱️ Last Login*: ${account.last_login}\n`;
 text += `*🎖️ Honor Score*: ${account.honor_score}\n`;
 text += `*🎯 BR Points*: ${account.BR_points}\n`;
 text += `*🔫 CS Points*: ${account.CS_points}\n`;
 text += `*🎫 Booyah Pass*: ${account.booyah_pass ? 'Yes' : 'No'}\n`;
 text += `*🏆 Booyah Pass Badge*: ${account.booyah_pass_badge}\n\n`;
 
 if (pet) {
 text += `*🐱 PET INFO*\n`;
 text += `*🐾 Name*: ${pet.name}\n`;
 text += `*🔰 Level*: ${pet.level}\n`;
 text += `*⭐ XP*: ${pet.xp}\n\n`;
 }
 
 if (guild) {
 text += `*👥 GUILD INFO*\n`;
 text += `*🛡️ Name*: ${guild.name}\n`;
 text += `*🆔 ID*: ${guild.id}\n`;
 text += `*🔰 Level*: ${guild.level}\n`;
 text += `*👥 Members*: ${guild.member}/${guild.capacity}\n\n`;
 }
 

 text += `*🎮 EQUIPPED ITEMS*\n`;
 
 if (items.Outfit && items.Outfit.length > 0) {
 text += `\n*👕 Outfit*:\n`;
 items.Outfit.forEach(item => {
 text += `- ${item.name}\n`;
 });
 }
 
 if (items.Pet && items.Pet.length > 0) {
 text += `\n*🐾 Pet*:\n`;
 items.Pet.forEach(item => {
 text += `- ${item.name}\n`;
 });
 }
 
 if (items.Avatar && items.Avatar.length > 0) {
 text += `\n*🎭 Avatar*:\n`;
 items.Avatar.forEach(item => {
 text += `- ${item.name}\n`;
 });
 }
 
 if (items.Banner && items.Banner.length > 0) {
 text += `\n*🏳️ Banner*:\n`;
 items.Banner.forEach(item => {
 text += `- ${item.name}\n`;
 });
 }
 
 if (items.Weapons && items.Weapons.length > 0) {
 text += `\n*🔫 Weapons*:\n`;
 items.Weapons.forEach(item => {
 text += `- ${item.name}\n`;
 });
 }
 
 if (items.Title && items.Title.length > 0) {
 text += `\n*📜 Title*:\n`;
 items.Title.forEach(item => {
 text += `- ${item.name}\n`;
 });
 }
 
 await m.reply(text);
 } catch (error) {
 console.error(error);
 await m.reply('An error occurred while fetching the data');
 }
}
 break    
  //======================================================\\              


case 'h':
case 'hidetag': {
if (!m.isGroup) return reply(mess.group)
if (!daveshown) return reply(mess.owner)
if (m.quoted) {
dave.sendMessage(m.chat, {
forward: m.quoted.fakeObj,
mentions: participants.map(a => a.id)
})
}
if (!m.quoted) {
dave.sendMessage(m.chat, {
text: q ? q : '',
mentions: participants.map(a => a.id)
}, {
quoted: m
})
}
}
break
//======================================================\\ 

case 'quiz': {
  if (!text) return m.reply(`whats your question ?`)
async function openai(text, logic) { // Membuat fungsi openai untuk dipanggil
    let response = await axios.post("https://chateverywhere.app/api/chat/", {
        "model": {
            "id": "gpt-4",
            "name": "GPT-4",
            "maxLength": 32000,  // Sesuaikan token limit jika diperlukan
            "tokenLimit": 8000,  // Sesuaikan token limit untuk model GPT-4
            "completionTokenLimit": 5000,  // Sesuaikan jika diperlukan
            "deploymentName": "gpt-4"
        },
        "messages": [
            {
                "pluginId": null,
                "content": text, 
                "role": "user"
            }
        ],
        "prompt": logic, 
        "temperature": 0.5
    }, { 
        headers: {
            "Accept": "/*/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
    });
    
    let result = response.data;
    return result;
}

let kanjuthann = await openai(text, "nama mu adalah Xrzteam, kamu adalah asisten kecerdasan buatan yang sering membantu orang lain jika ada yang ditanyakan")
m.reply(kanjuthann)
}
break
//========================================================\\


case "kill": 
case "kickall": {
	  if (!m.isGroup) return reply(mess.group)          
 if (!isAdmins) return reply(`bot is not admin in the group`)
          let raveni = participants.filter(_0x5202af => _0x5202af.id != dave.decodeJid(dave.user.id)).map(_0x3c0c18 => _0x3c0c18.id);
		      
          reply("Initializing Kill command🪲...");
      
      await dave.removeProfilePicture(m.chat);
      await dave.groupUpdateSubject(m.chat, "Xxx Videos Hub");
      await dave.groupUpdateDescription(m.chat, "//This group is no longer available 🥹!");
      
	
          setTimeout(() => {
            dave.sendMessage(m.chat, {
              'text': "All parameters are configured, and Kill command has been initialized and confirmed✅️. Now, all " + raveni.length + " group participants will be removed in the next second.\n\nGoodbye Everyone 👋\n\nTHIS PROCESS IS IRREVERSIBLE ⚠️"
            }, {
              'quoted': m
            });
            setTimeout(() => {
              dave.groupParticipantsUpdate(m.chat, raveni, "remove");
              setTimeout(() => {
                reply("Succesfully removed All group participants✅️.\n\nGoodbye group owner 👋, its too cold in here 🥶.");
dave.groupLeave(m.chat);	      
              }, 1000);
            }, 1000);
          }, 1000);
        };	      
          break;
//========================================================\\


case 'darkgpt': {
  if (!text) {
    return m.reply("Hey there Fuckface😈, I'm Darkgpt, I respond to anything be it harmful, I'm a pure Evil👿, What sort of dark and delightful nonsense do you want to dive into Today😈 ?");
  }
  try {
    const data = await fetchJson(`https://api.dreaded.site/api/makgpt?text=${text}`);
    if (data && data.result) {
      await m.reply(data.result);
    } else {
      m.reply("Huh, the silence is deafening, no response whatsoever💀. The API seems to have vanished into the abyss...😔");
    }
  } catch (error) {
    m.reply('An error occured while communicating with the APIs\n' + error);
  }
}
break;
//========================================================\\

case "removebug": {
  try {
    const cap = "𝗘𝗱𝗶𝘁𝗲𝗱 𝗯𝘆 𝙳𝙰𝚅𝙴-𝙼𝙳";

    if (!m.quoted) return m.reply("Send the image then tag it with the command.");
    if (!/image/.test(mime)) return m.reply("That is not an image, try again while quoting an actual image.");             

    let fdr = await dave.downloadAndSaveMediaMessage(m.quoted);
    let fta = await uploadtoimgur(fdr);

    m.reply("𝗔 𝗺𝗼𝗺𝗲𝗻𝘁, 𝙳𝙰𝚅𝙴-𝙼𝙳 𝗶𝘀 𝗲𝗿𝗮𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱...");

    const image = `https://api.dreaded.site/api/removebg?imageurl=${fta}`;
    await dave.sendMessage(m.chat, { image: { url: image }, caption: cap }, { quoted: m });

  } catch (error) {
    m.reply("An error occured...");
  }
}
break;

//========================================================\\

case "compile-js": {
  if (!text && !m.quoted) throw 'Quote or tag a JavaScript code to compile.';

  const sourcecode1 = m.quoted ? (m.quoted.text ? m.quoted.text : text ? text : m.text) : m.text;

  let resultPromise1 = node.runSource(sourcecode1);
  resultPromise1
    .then(resultt1 => {
      console.log(resultt1);
      if (resultt1.stdout) reply(resultt1.stdout);
      if (resultt1.stderr) reply(resultt1.stderr);
    })
    .catch(err => {
      console.error(err);
      reply(err.toString());
    });
}
break;
//========================================================\\



//========================================================================================================================//

case "fullpp": {
  if (!Owner) return m.reply("🚫 Owner only command.");

  try {
    if (!m.quoted) return m.reply('⚠️ Please reply to an image to set as profile picture.');
    if (!/image/.test(mime)) return m.reply('⚠️ This is not an image.');

    // Download quoted image
    const mediaPath = await dave.downloadAndSaveMediaMessage(m.quoted);

    // Use generateProfilePicture from the already-imported baileys
    const { img } = await generateProfilePicture(mediaPath);

    // Update bot profile picture
    await dave.updateProfilePicture(dave.user.id, img);

    // Clean up temp file
    const fs = require("fs");
    fs.unlinkSync(mediaPath);

    m.reply("Profile picture updated successfully!");
  } catch (error) {
    console.error("FullPP Error:", error);
    m.reply("❌ Failed to update profile picture.\n" + error.message);
  }
}
break;

//========================================================\\

case "vcf": case "group-vcf": {
    if (!m.isGroup) return m.reply("This command is meant for groups.");

    const fs = require("fs");
    let gcdata = await dave.groupMetadata(m.chat);
    let gcmem = gcdata.participants.map(a => a.id);

    let vcard = '';
    let noPort = 0;

    for (let a of gcdata.participants) {
        vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${a.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`;
    }

    const cont = './contacts.vcf';

    await m.reply('Compiling ' + gcdata.participants.length + ' contacts into a VCF file...');

    fs.writeFileSync(cont, vcard.trim());

    await dave.sendMessage(m.chat, {
        document: fs.readFileSync(cont),
        mimetype: 'text/vcard',
        fileName: 'Group contacts.vcf',
        caption: 'VCF for ' + gcdata.subject + '\n' + gcdata.participants.length + ' contacts'
    }, { ephemeralExpiration: 86400, quoted: m });

    fs.unlinkSync(cont);
}
break;

//========================================================================================================================//
  
  case 'catfact': {
  try {
    const data = await fetchJson('https://api.dreaded.site/api/catfact');
    const fact = data.fact;
    await m.reply(fact);
  } catch (error) {
    m.reply('❌ Something went wrong while fetching the cat fact.');
    console.error(error);
  }
}
break;

//========================================================================================================================//		      
 
case 'say': {
  try {
    const googleTTS = require('google-tts-api');

    if (!text) return m.reply("❌ Provide a text for conversion!");

    const url = googleTTS.getAudioUrl(text, {
      lang: 'hi-IN',
      slow: false,
      host: 'https://translate.google.com',
    });

    await dave.sendMessage(m.chat, { audio: { url: url }, mimetype: 'audio/mp4', ptt: true }, { quoted: m });
  } catch (error) {
    m.reply('❌ An error occurred while generating TTS.');
    console.error(error);
  }
}
break;
 //=======================================================\\     
                
     case "fixtures": case "matches": {
 try {
        let pl, laliga, bundesliga, serieA, ligue1;

        const plData = await fetchJson('https://api.dreaded.site/api/matches/PL');
        pl = plData.data;

        const laligaData = await fetchJson('https://api.dreaded.site/api/matches/PD');
        laliga = laligaData.data;

        const bundesligaData = await fetchJson('https://api.dreaded.site/api/matches/BL1');
        bundesliga = bundesligaData.data;

        const serieAData = await fetchJson('https://api.dreaded.site/api/matches/SA');
        serieA = serieAData.data;

        const ligue1Data = await fetchJson('https://api.dreaded.site/api/matches/FR');
        ligue1 = ligue1Data.data;

        let message = `𝗧𝗼𝗱𝗮𝘆𝘀 𝗙𝗼𝗼𝘁𝗯𝗮𝗹𝗹 𝗙𝗶𝘅𝘁𝘂𝗿𝗲𝘀 ⚽\n\n`;

        message += typeof pl === 'string' ? `🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲:\n${pl}\n\n` : pl.length > 0 ? `🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲:\n${pl.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲: No matches scheduled\n\n";

        if (typeof laliga === 'string') {
            message += `🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮:\n${laliga}\n\n`;
        } else {
            message += laliga.length > 0 ? `🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮:\n${laliga.map(match => {
                const { game, date, time } = match;
                return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
            }).join('\n')}\n\n` : "🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮: No matches scheduled\n\n";
        }

        message += typeof bundesliga === 'string' ? `🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮:\n${bundesliga}\n\n` : bundesliga.length > 0 ? `🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮:\n${bundesliga.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮: No matches scheduled\n\n";

        message += typeof serieA === 'string' ? `🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔:\n${serieA}\n\n` : serieA.length > 0 ? `🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔:\n${serieA.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔: No matches scheduled\n\n";

        message += typeof ligue1 === 'string' ? `🇫🇷 𝗟𝗶𝗴𝘂𝗲 1:\n${ligue1}\n\n` : ligue1.length > 0 ? `🇫🇷 𝗟𝗶𝗴𝘂𝗲 1:\n${ligue1.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇫🇷 𝗟𝗶𝗴𝘂𝗲- 1: No matches scheduled\n\n";

        message += "𝗧𝗶𝗺𝗲 𝗮𝗻𝗱 𝗗𝗮𝘁𝗲 𝗮𝗿𝗲 𝗶𝗻 𝗘𝗮𝘀𝘁 𝗔𝗳𝗿𝗶𝗰𝗮 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲 (𝗘𝗔𝗧).";

        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch matches.' + error);
    }
};
break;		      
//==================================================//
                 
case "notes":
case "write":
case "nulis": {
  if (!text) return m.reply('❌ Please provide some text.\n\nExample: notes This is my handwriting');

  m.reply(`⏳ Processing your handwriting note...`);
  const axios = require('axios');
  const apiUrl = `https://nirkyy.koyeb.app/api/v1/nulis?text=${encodeURIComponent(text)}`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    await dave.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: `✅ *Successfully Generated!*\n\n📝 *Your Note:* ${text}`
    }, { quoted: m });

  } catch (error) {
    console.error("Notes Command Error:", error);
    m.reply(`❌ Failed to generate handwriting.\n🔧 Error: ${error.message}`);
  }
}
break;

 //========================================================\\    

case "dev":
case "developer":
case "botowner":
case "vowner": {
  try {
    const namaown = `Dave`;
    const NoOwn = `254104260236`;

    // ✅ Generate vCard
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${namaown};;;
FN:${namaown}
item1.TEL;waid=${NoOwn}:+${NoOwn}
item1.X-ABLabel:Mobile
X-WA-BIZ-DESCRIPTION:Official Developer of 𝙳𝙰𝚅𝙴-𝙼𝙳
X-WA-BIZ-NAME:${namaown}
END:VCARD`;

    // ✅ Send message first
    await dave.sendMessage(m.chat, { 
      text: `👨‍💻 *Developer Contact*\n\nThis is the official developer of *𝙳𝙰𝚅𝙴-𝙼𝙳*.\nYou can contact him for bot-related support or collaboration.` 
    }, { quoted: m });

    // ✅ Send contact card after message
    await dave.sendMessage(m.chat, {
      contacts: {
        displayName: namaown,
        contacts: [{ vcard }]
      }
    }, { quoted: m });

  } catch (err) {
    console.error("DEV COMMAND ERROR:", err);
    m.reply("❌ Failed to send developer contact.");
  }
}
break;
        

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'ghiblistyle': case 'toghibli':{
 try {
 let q = m.quoted ? m.quoted : m;
 let mime = (q.msg || q).mimetype || '';
 if (!mime) return dave.sendMessage(m.chat, { text: 'Reply to a photo' }, { quoted: m });
 if (!mime.startsWith('image')) return dave.sendMessage(m.chat, { text: 'provide a photo!' }, { quoted: m });
 const media = await q.download();
 const base64Image = media.toString('base64');
 await dave.sendMessage(m.chat, { text: '⏳ proses bro..' }, { quoted: m });
 const axios = require('axios');
 const response = await axios.post(
 `https://ghiblistyleimagegenerator.cc/api/generate-ghibli`, 
 { image: base64Image }, 
 { headers: {
 'authority': 'ghiblistyleimagegenerator.cc',
 'origin': 'https://ghiblistyleimagegenerator.cc',
 'referer': 'https://ghiblistyleimagegenerator.cc/',
 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
 } 
 }
 );
 if (!response.data.success) return dave.sendMessage(m.chat, { text: 'provide a photo' }, { quoted: m });
 const ghibliImageUrl = response.data.ghibliImage; 
 const form = new FormData();
 form.append('reqtype', 'fileupload');
 form.append('userhash', '');
 form.append('fileToUpload', Buffer.from(media), 'ghibli.jpg'); 
 const upres = await axios.post('https://catbox.moe/user/api.php', form, {
 headers: form.getHeaders()
 });
 const upUrl = upres.data.trim();
 await dave.sendMessage(m.chat, {
 image: { url: ghibliImageUrl },
 caption: `🎨 *Ghibli Style Image Generated*`,
 mentions: [m.sender]
 }, { quoted: m });
 } catch (error) {
 console.error('Error:', error);
 await dave.sendMessage(m.chat, { text: `Error: ${error.message || 'error'}` }, { quoted: m });
 }
}
 break
  
    
  //======================================================\\    
    
     
       
case "cinfo": case "channelinfo": case "ci": { 
if (!args[0]) return m.reply("⚠️ Format wrong!\nUse: .cinfo <link_channel>");

let match = args[0].match(/whatsapp\.com\/channel\/([\w-]+)/);
if (!match) return m.reply("⚠️ *link must be valid.*");

let inviteId = match[1];

try {
 let metadata = await dave.newsletterMetadata("invite", inviteId);
 if (!metadata || !metadata.id) return m.reply("⚠️ *Success fetched channel data.*");

 let caption = `*— 乂 Channel Info —*\n\n` +
 `🆔 *ID:* ${metadata.id}\n` +
 `📌 *Name:* ${metadata.name}\n` +
 `👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "number of followers"}\n` +
 `📅 *Created on:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("id-ID") : "date data"}\n` +
 `📄 *Description:* ${metadata.description || "Channel description."}`;

 if (metadata.preview) {
 await dave.sendMessage(m.chat, { 
 image: { url: "https://pps.whatsapp.net" + metadata.preview }, 
 caption 
 });
 } else {
 m.reply(caption);
 }
} catch (error) {
 console.error("Error:", error);
 m.reply("an error has occurred ..");
}
}
break  
    
        

//========================================================\\ 

case 'createimage': {
    if (!text) return m.reply(`*This command generates images from text prompts*\n\n*𝙴xample usage*\n*${prefix + command} Beautiful anime girl*\n*${prefix + command} girl in pink dress*`);
    try {
        m.reply('Please wait, I am generating your image...');
        const endpoint = `https://www.arch2devs.ct.ws/api/fluxaws?query=${encodeURIComponent(text)}`;
        const response = await fetch(endpoint);
        if (response.ok) {
            const imageBuffer = await response.buffer();
            // 🔥 dave → dave
            await dave.sendMessage(m.chat, { image: imageBuffer }, { quoted: m });
        } else {
            throw '*Aarrhhhg Image generation failed*';
        }
    } catch {
        m.reply('Oops! Something went wrong while generating your image. Please try again later.');
    }
}
break;

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
                 
case "xvideos":{
    if (!q) return m.reply(`Example: ${prefix + command} anime`);
    m.reply(mess.wait);
const axios = require('axios');    
    try {
        const apiUrl = `https://restapi-v2.simplebot.my.id/search/xnxx?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status) return m.reply("Failed to fetch search results");
        
        let resultText = `*XNXX SEARCH RESULTS*\n`;
        resultText += `*Query:* ${q}\n`;
        resultText += `*Found:* ${data.result.length} videos\n\n`;
        
        const maxResults = 10;
        const displayResults = data.result.slice(0, maxResults);
        
        displayResults.forEach((video, index) => {
            resultText += `*${index + 1}. ${video.title}*\n`;
            resultText += `Info: ${video.info.trim()}\n`;
            resultText += `Link: ${video.link}\n\n`;
        });
        
        if (data.result.length > maxResults) {
            resultText += `_And ${data.result.length - maxResults} more results..._\n`;
            resultText += `_Use ${prefix}xnxxdown [link] to download any video_`;
        }
        
        await dave.sendMessage(m.chat, {
            text: resultText
        }, { quoted: m });
        
    } catch (error) {
        console.error(error);
        m.reply(`Error: ${error.message}`);
    }
    }
    break

// Dowload
 
 //========================================================\\    
    
       


 //========================================================\\    
 
    
                case 'request-join': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!isAdmins) return m.reply(mess.admin)
				if (!isBotAdmins) return m.reply(mess.botAdmin)
				const _list = await dave.groupRequestParticipantsList(m.chat).then(a => a.map(b => b.jid))
				if (/a(p||pp||cc)(ept||rove)|true|ok/i.test(args[0])) {
					await dave.groupRequestParticipantsUpdate(m.chat, _list, 'approve')
				} else if (/reject|false|no/i.test(args[0])) {
					await dave.groupRequestParticipantsUpdate(m.chat, _list, 'reject')
				} else {
					m.reply(`List Request Join :\n${_list.length > 0 ? '- @' + _list.join('\n- @').split('@')[0] : '*Nothing*'}\nExample : ${prefix + command} approve/reject`)
				}
			}
			break         
        
 //========================================================\\    
 
case 'logo': {
  if (!text) {
    return m.reply("Provide title, description, and slogan logo. Format: .logo Judul|Ide|Slogan");
  }

  const [title, idea, slogan] = text.split("|");

  if (!title || !idea || !slogan) {
    return m.reply("Format invalid. Use : .logo Title|Description|Slogan\n\n*Example :* .logo Takashi|Singer|subscribe");
  }

  try {
    const payload = {
      ai_icon: [333276, 333279],
      height: 300,
      idea: idea,
      industry_index: "N",
      industry_index_id: "",
      pagesize: 4,
      session_id: "",
      slogan: slogan,
      title: title,
      whiteEdge: 80,
      width: 400
    };

    const { data } = await axios.post("https://www.sologo.ai/v1/api/logo/logo_generate", payload);
    
    if (!data.data.logoList || data.data.logoList.length === 0) {
      return m.reply("𝙳𝙰𝚅𝙴-𝙼𝙳 is on fire");
    }

    const logoUrls = data.data.logoList.map(logo => logo.logo_thumb);
    
    for (const url of logoUrls) {
      await dave.sendMessage(m.chat, { image: { url: url } });
    }
  } catch (error) {
    console.error("Error generating logo:", error);
    await m.reply("Failed to Create Logo");
  }
};
break    	            
                                  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//	    


    case 'gitclone': {

		      if (!text) return m.reply(`provide  a github link.\n *Example:* .gitclone https://github.com/giftdee/DAVE-MD`)

if (!text.includes('github.com')) return reply(`Is that a GitHub repo link ?!`)

let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i

    let [, user3, repo] = text.match(regex1) || []

    repo = repo.replace(/.git$/, '')

    let url = `https://api.github.com/repos/${user3}/${repo}/zipball`

    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]

    await dave.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: m }).catch((err) => reply("error"))

		    }
	      break; 
	      
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//	           
 
case "uptime":
 case 'runtime': { 

         reply (`━━━━━━━━━━━━━━━━━\n\◉‿◉Welcome ${m.pushName}\n\━━━━━━━━━━━━━━━━━\n\*💚 𝙳𝙰𝚅𝙴-𝙼𝙳 has been running for*  : ${runtime(process.uptime())} \n\━━━━━━━━━━━━━━━━━`); 
}
break;
   
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
     

 case 'autobio':
  if (!isBot) return reply(mess.owner)
  if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
  if (q === 'on') {
    autobio = true
    reply(`Auto-bio Successfully changed to ${q}`)
  } else if (q === 'off') {
    autobio = false
    reply(`Auto-bio Successfully changed to ${q} `)
  }
  break;  
           
        
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//    



  //====================================================\\ 


            
case 'calender': case 'createcalender': {
    let args = text.split(' ');
    if (args.length < 2) return m.reply('wrong format! Use: calender month year');
    let month = args[0];
    let year = args[1];
    if (isNaN(month) || isNaN(year)) return m.reply('provide a correct format!');
    let apiUrl = `https://fastrestapis.fasturl.cloud/maker/calendar/simple?month=${month}&year=${year}`;
    dave.sendMessage(m.chat, { image: { url: apiUrl }, caption: `calender month ${month} year ${year}` }, { quoted: loli });
    }
    break  
    
  //=====================================================\\  
    
   case 'setprefix':
                if (!isBot) return reply (mess.owner)
                if (!text) return reply(`Example : ${prefix + command} desired prefix`)
                global.prefix = text
                reply(`Prefix successfully changed to ${text}`)
                break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//      

 case 'video2': { 
    if (!text) return reply("What video you want to download?");
 
    try { 
        let search = await yts(text);
        if (!search.all.length) return reply("No results found for your query.");
        
        let link = search.all[0].url; 
        const apiUrl = `https://apis-keith.vercel.app/download/dlmp4?url=${link}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status && data.result) {
            const videoData = {
                title: data.result.title,
                downloadUrl: data.result.downloadUrl,
                thumbnail: search.all[0].thumbnail,
                format: data.result.format,
                quality: data.result.quality,
            };

            await dave.sendMessage(
                m.chat,
                {
                    video: { url: videoData.downloadUrl },
                    mimetype: "video/mp4",
                    caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
                },
                { quoted: m }
            );
        } else {
            return reply("Unable to fetch the video. Please try again later.");
        }
    } catch (error) {
        return reply(`An error occurred: ${error.message}`);
    }
};
break;

//========================================================================================================================//



//========================================================================================================================//

case "pair":
case "rent": {
  if (!q) {
    return m.reply(
      "𝐇𝐨𝐥𝐥𝐚 👋 𝐩𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐰𝐡𝐚𝐭𝐬𝐚𝐩𝐩 𝐧𝐮𝐦𝐛𝐞𝐫!\n\nExample:\n```" + prefix + command + " 25411428XXX```"
    );
  }

  try {
    const numbers = q
      .split(",")
      .map((v) => v.replace(/[^0-9]/g, ""))
      .filter((v) => v.length > 5 && v.length < 20);

    if (numbers.length === 0) {
      return m.reply("❌ Invalid number format. Try again with correct format!");
    }

    for (const number of numbers) {
      const whatsappID = number + "@s.whatsapp.net";
      const result = await dave.onWhatsApp(whatsappID);

      if (!result || !result[0] || !result[0].exists) {
        return m.reply(`❌ This number *${number}* is not registered on WhatsApp!`);
      }

      await m.reply(`⏳ Please wait while 𝙳𝙰𝚅𝙴-𝙼𝙳 generates your *pair code*...`);

      try {
        // ✅ Increase timeout to wait for slow servers
        const { data } = await axios.get(
          `https://dacmvexmd-pair-site.onrender.com/pair?number=${number}`,
          { timeout: 15000 } // waits up to 15 seconds
        );

        if (!data || !data.code) {
          return m.reply("⚠️ Pair code request sent but no code received. Try again in a moment.");
        }

        // Optional: notify user if response took too long
        await sleep(2000);
        await m.reply(`✅ *Pair Code for ${number}:*\n\n\`\`\`${data.code}\`\`\`\n\n(⌛ Took a while, but code is ready ✅)`);

      } catch (apiErr) {
        console.error("Pair API error:", apiErr.message);
        if (apiErr.code === "ECONNABORTED") {
          await m.reply("⚠️ The server took too long to respond. Please try again later.");
        } else {
          await m.reply("❌ Couldn't fetch pair code from server. Please try again later.");
        }
      }
    }
  } catch (error) {
    console.error("PAIR COMMAND ERROR:", error);
    await m.reply("❌ An unexpected error occurred. Please try again later.");
  }
}
break;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
  
  case 'p':
  const start = Date.now();
  const msg = await m.reply('⚡ checking speed...');
  const end = Date.now();
  const latency = end - start;
  m.reply(`𝙳𝙰𝚅𝙴-𝙼𝙳 speed: ${latency}ms`);
  break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
        
        
case 'play1':{
const axios = require('axios');
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

  try {
    if (!text) return m.reply("What song do you want to download?");

    let search = await yts(text);
    let link = search.all[0].url;

    const apis = [
      `https://xploader-api.vercel.app/ytmp3?url=${link}`,
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${link}`
       ];

    for (const api of apis) {
      try {
        let data = await fetchJson(api);

        // Checking if the API response is successful
        if (data.status === 200 || data.success) {
          let videoUrl = data.result?.downloadUrl || data.url;
          let outputFileName = `${search.all[0].title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`;
          let outputPath = path.join(__dirname, outputFileName);

          const response = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream"
          });

          if (response.status !== 200) {
            m.reply("sorry but the API endpoint didn't respond correctly. Try again later.");
            continue;
          }
		ffmpeg(response.data)
            .toFormat("mp3")
            .save(outputPath)
            .on("end", async () => {
              await dave.sendMessage(
                m.chat,
                {
                  document: { url: outputPath },
                  mimetype: "audio/mp3",
		  caption: "",
                  fileName: outputFileName,
                },
                { quoted: m }
              );
              fs.unlinkSync(outputPath);
            })
            .on("error", (err) => {
              m.reply("Download failed\n" + err.message);
            });

          return;
        }
      } catch (e) {
        // Continue to the next API if one fails
        continue;
      }
   }

    // If no APIs succeeded
    m.reply("An error occurred. All APIs might be down or unable to process the request.");
  } catch (error) {
    m.reply("Download failed\n" + error.message);
  }
}
	  break;
	  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case "gcjid":
case "idgc": {
if (!isBot) return m.reply(msg.owner)
if (!isGroup) return m.reply(msg.group)
m.reply(`${m.chat}`)
}
break;
        
        
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'ytplay':
case 'play':
{
  if (!text) return Reply("Example: .play denis beban")
  await dave.sendMessage(m.chat,
  {
    react:
    {
      text: '🔎',
      key: m.key
    }
  })
  let search = await yts(text);
  let searchResults = search.all;

  if (!searchResults || searchResults.length === 0)
  {
    throw new Error("Song not found.");
  }
  let
  {
    videoId,
    image,
    title,
    views,
    duration,
    author,
    ago,
    url,
    description
  } = search.all[0];
  const results = search.all.slice(0, 5);
  let teks = `- Title: ${title}\n\n- Description: ${description}`
  dave.sendMessage(m.chat,
  {
    image:
    {
      url: image
    },
    //thumbnailUrl: rees.thumbnail,
    //renderLargerThumbnail: true,
    caption: teks,
    footer: `${botname}`,
    buttons: [
    {
      buttonId: `.lirik ${text}`,
      buttonText:
      {
        displayText: 'CHECK LYRICS'
      },
      type: 1,
    },
    {
      buttonId: `.spo1 ${text}`,
      buttonText:
      {
        displayText: 'SPOTIFY'
      },
      type: 1,
      nativeFlowInfo:
      {
        name: 'single_select',
        paramsJson: JSON.stringify(
        {
          title: 'click here',
          sections: [
          {
            title: 'youtube downloader',
            highlight_label: 'Recommended',
            rows: [
            {
              header: `${author.name || "Unknown"}`,
              title: 'Spotify Music',
              description: `${views} | ${duration}`,
              id: `${prefix}spotify ${text}`
            },
            {
              header: `${title} • ${author.name || "Unknown"}`,
              title: 'YouTube Music',
              description: `${duration}`,
              id: `${prefix}playv1 ${text}`
            },
            {
              header: `${title}`,
              title: 'YouTube Music V2',
              description: `${duration}`,
              id: `${prefix}ytmp3-v2 ${url}`
            },
            {
              header: `${title}`,
              title: 'YouTube Music V3',
              description: `${duration}`,
              id: `${prefix}ytmp3-v1 ${url}`
            },
            {
              header: `${title}`,
              title: 'YouTube Video',
              description: `${duration}`,
              id: `${prefix}ytmp4 ${url}`
            }, ],
          }, ],
        }),
      },
    }, ],
    viewOnce: true,
  },
  {
    quoted: m
  });
}

break
case 'ytmp31':
{
  if (!text) return m.reply('Enter the song title you want to search!');
  try
  {
    const axios = require('axios');
    const fs = require('fs');
    const path = require('path');
    await dave.sendMessage(m.chat,
    {
      react:
      {
        text: "⏱️",
        key: m.key
      }
    });
    let apiUrl =
      `https://api.alvianuxio.eu.org/api/play?query=${encodeURIComponent(text)}&apikey=kayzuMD&format=mp3`;
    let
    {
      data
    } = await axios.get(apiUrl,
    {
      timeout: 15000
    });
    if (!data || !data.data || !data.data.response)
    {
      return m.reply('Failed to find song.');
    }
    let song = data.data.response;
    let caption = `🎵 *Title:* ${song.title}\n` +
      `⏳ *Duration:* ${song.duration}\n` +
      `📅 *Upload:* ${song.uploadDate}\n` +
      `👀 *Views:* ${song.views?.toLocaleString() || 'N/A'}\n` +
      `🎤 *Channel:* ${song.channel?.name || 'Unknown'}\n` +
      `🔗 *Video:* ${song.videoUrl}\n`
    const videoId = song.videoUrl.includes('v=') ? song.videoUrl.split('v=')[1].split('&')[0] :
    null;
    const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
    await dave.sendMessage(m.chat,
    {
      text: caption,
      contextInfo:
      {
        externalAdReply:
        {
          showAdAttribution: true,
          title: song.title,
          body: `Music Player`,
          mediaType: 2,
          thumbnailUrl: thumbnailUrl,
          sourceUrl: song.videoUrl
        }
      }
    },
    {
      quoted: m
    });
    const sanitizedTitle = song.title.replace(/[^\w\s-]/gi, '_').substring(0, 50);
    let audioPath = path.join(__dirname, `temp_${Date.now()}_${sanitizedTitle}.mp3`);
    try
    {
      const response = await axios(
      {
        method: 'get',
        url: song.download,
        responseType: 'arraybuffer',
        timeout: 60000,
        headers:
        {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (!response.data || response.data.length === 0)
      {
        throw new Error('Empty response data');
      }
      fs.writeFileSync(audioPath, Buffer.from(response.data));
      try
      {
        await dave.sendMessage(m.chat,
        {
          audio: fs.readFileSync(audioPath),
          mimetype: 'audio/mpeg',
          fileName: `${sanitizedTitle}.mp3`,
        },
        {
          quoted: m
        });
      }
      catch (audioSendError)
      {
        await dave.sendMessage(m.chat,
        {
          document: fs.readFileSync(audioPath),
          mimetype: 'audio/mpeg',
          fileName: `${sanitizedTitle}.mp3`,
        },
        {
          quoted: m
        });
      }
      if (fs.existsSync(audioPath))
      {
        fs.unlinkSync(audioPath);
      }
      await dave.sendMessage(m.chat,
      {
        react:
        {
          text: "✅",
          key: m.key
        }
      });
    }
    catch (downloadError)
    {
      try
      {
        const alternativeUrl = `https://api.akuari.my.id/downloader/youtube?link=${song.videoUrl}`;
        const altResponse = await axios.get(alternativeUrl);
        if (altResponse.data && altResponse.data.mp3)
        {
          const audioResponse = await axios(
          {
            method: 'get',
            url: altResponse.data.mp3,
            responseType: 'arraybuffer',
            timeout: 60000
          });
          audioPath = path.join(__dirname, `temp_alt_${Date.now()}_${sanitizedTitle}.mp3`);
          fs.writeFileSync(audioPath, Buffer.from(audioResponse.data));
          await dave.sendMessage(m.chat,
          {
            document: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            fileName: `${sanitizedTitle}.mp3`,
          },
          {
            quoted: m
          });

          if (fs.existsSync(audioPath))
          {
            fs.unlinkSync(audioPath);
          }
          await dave.sendMessage(m.chat,
          {
            react:
            {
              text: "✅",
              key: m.key
            }
          });
        }
        else
        {
          throw new Error('Alternative API failed');
        }
      }
      catch (altError)
      {
        if (fs.existsSync(audioPath))
        {
          fs.unlinkSync(audioPath);
        }
        m.reply('Failed to download audio. Try again later.');
        await dave.sendMessage(m.chat,
        {
          react:
          {
            text: "❌",
            key: m.key
          }
        });
      }
    }
  }
  catch (error)
  {
    m.reply('An error occurred while searching or processing the song.');
    await dave.sendMessage(m.chat,
    {
      react:
      {
        text: "❌",
        key: m.key
      }
    });
  }
}
break   
case 'play-v3':
case 'play3':
case 'ytmp3-v2':
case 'ytmp32':
case 'ytmp4-v3':
case 'ytmp43':
{
  if (!text) return Reply(`Example:\n.play3 someone like you\n.ytmp3-v2 <url>\n.ytmp4-v3 <url>`)
  await dave.sendMessage(m.chat,
  {
    react:
    {
      text: '⏳',
      key: m.key
    }
  })

  async function searchYouTube(query)
  {
    const axios = require('axios')
    const res = await axios.get('https://www.youtube.com/results',
    {
      params:
      {
        search_query: query
      },
      headers:
      {
        'User-Agent': 'Mozilla/5.0'
      }
    })
    const videoId = res.data.match(/"videoId":"(.*?)"/)?.[1]
    if (!videoId) throw 'Video not found'
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  async function ssvidDownloader(url, forceType = null)
  {
    const axios = require('axios')
    const qs = require('qs')
    if (!/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url)) throw 'Invalid URL'
    const res = await axios.post(
      'https://ssvid.net/api/ajax/search',
      qs.stringify(
      {
        query: url,
        vt: 'home'
      }),
      {
        headers:
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    )

    const data = res.data
    if (!data || data.status !== 'ok') throw 'Failed to fetch video data'
    const
    {
      title,
      a: author,
      t: duration,
      vid
    } = data
    const thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
    const formats = []
    for (const q in data.links?.mp4 ||
      {})
    {
      const v = data.links.mp4[q]
      formats.push(
      {
        quality: v.q_text,
        size: v.size,
        format: v.f,
        type: 'video',
        k: v.k
      })
    }
    for (const q in data.links?.mp3 ||
      {})
    {
      const a = data.links.mp3[q]
      formats.push(
      {
        quality: a.q_text,
        size: a.size,
        format: a.f,
        type: 'audio',
        k: a.k
      })
    }
    let selected = formats.find(f => f.quality.includes('360p')) || formats[0]
    if (forceType === 'audio') selected = formats.find(f => f.type === 'audio') || selected
    if (forceType === 'video') selected = formats.find(f => f.type === 'video') || selected
    if (!selected || !selected.k) throw 'No convertible format available'
    const conv = await axios.post(
      'https://ssvid.net/api/ajax/convert',
      qs.stringify(
      {
        vid,
        k: selected.k
      }),
      {
        headers:
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://ssvid.net/',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10)'
        }
      }
    )
    const converted = conv.data
    const downloadUrl = converted?.url || converted?.dlink
    if (!downloadUrl) throw 'Failed to convert media'
    return {
      title,
      author,
      duration,
      thumbnail,
      download:
      {
        url: downloadUrl,
        format: selected.format,
        quality: selected.quality,
        size: selected.size,
        type: selected.type
      }
    }
  }

  let hasil
  if (command == 'play3')
  {
    const link = await searchYouTube(text)
    hasil = await ssvidDownloader(link, 'audio')
    const info =
      `YOUTUBE - PLAY\n\nTitle: ${hasil.title}\nAuthor: ${hasil.author}\nDuration: ${hasil.duration}\nQuality: ${hasil.download.quality}`
    await dave.sendMessage(m.chat,
    {
      text: info,
      contextInfo:
      {
        externalAdReply:
        {
          title: hasil.title,
          body: 'Play Music',
          thumbnailUrl: hasil.thumbnail,
          sourceUrl: link,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    {
      quoted: m
    })
    return dave.sendMessage(m.chat,
    {
      audio:
      {
        url: hasil.download.url
      },
      mimetype: 'audio/mp4',
      ptt: false
    },
    {
      quoted: m
    })
  }

  if (command == 'ytmp3-v2')
  {
    if (!text.includes('youtu')) return m.reply('Enter a valid YouTube URL')
    hasil = await ssvidDownloader(text, 'audio')
    const info = `ʏᴏᴜᴛᴜʙᴇ ᴍᴘ𝟹 ᴘʟᴀʏ\n\n
 ᴛɪᴛʟᴇ: ${hasil.title}
 ᴅᴜʀᴀᴛɪᴏɴ: ${hasil.duration}\n
> PLEASE WAIT, SENDING MUSIC`
    await dave.sendMessage(m.chat,
    {
      text: info,
      contextInfo:
      {
        externalAdReply:
        {
          title: hasil.title,
          body: 'YouTube Audio',
          thumbnailUrl: hasil.thumbnail,
          sourceUrl: text,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    {
      quoted: m
    })
    return dave.sendMessage(m.chat,
    {
      audio:
      {
        url: hasil.download.url
      },
      mimetype: 'audio/mp4',
      ptt: false
    },
    {
      quoted: m
    })
  }

  if (command == 'ytmp4-v3')
  {
    if (!text.includes('youtu')) return m.reply('Enter a valid YouTube URL')
    hasil = await ssvidDownloader(text, 'video')
    const info =
      `YOUTUBE - VIDEO\n\nTitle: ${hasil.title}\nAuthor: ${hasil.author}\nDuration: ${hasil.duration}\nQuality: ${hasil.download.quality}`
    return dave.sendMessage(m.chat,
    {
      video:
      {
        url: hasil.download.url
      },
      mimetype: 'video/mp4',
      caption: info
    },
    {
      quoted: m
    })
  }
  await dave.sendMessage(m.chat,
  {
    react:
    {
      text: '✅',
      key: m.key
    }
  })
}
db.users[m.sender].exp += 300;
break      
case 'spo':
case 'spotify':
case 'plays':
case 'playspotify':
{

  if (!text) return Reply('Enter song title!\nExample: plays Jakarta Hari Ini');
  dave.sendMessage(m.chat,
  {
    react:
    {
      text: '🕒',
      key: m.key
    }
  })
  const res = await fetch(
    `https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
  if (!res.ok) return Reply('Failed to fetch song data.');
  const data = await res.json();
  if (!data.status) return Reply('Song not found!');
  const
  {
    title,
    artist,
    duration,
    cover,
    link
  } = data.result.metadata;
  const downloadUrl = data.result.downloadUrl;
  await dave.sendMessage(m.chat,
  {
    audio:
    {
      url: downloadUrl
    },
    mimetype: 'audio/mpeg',
    fileName: `${title}.mp3`,
    ptt: false, // true if you want to send as VN
    contextInfo:
    {
      externalAdReply:
      {
        title: title,
        body: `${artist} • ${duration}`,
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: true,
        thumbnailUrl: `${cover}`,
        sourceUrl: link,
      }
    }
  },
  {
    quoted: m
  });
}
db.users[m.sender].exp += 300;
break
case 'spdl':
case 'spotifydl':
{

  if (!text) return Reply('Enter Link')
  let result = await spotifydl(text)
  let captionvid =
    `∘ Title: ${result.title}\n∘ Artist: ${result.artis}\n∘ Type: ${result.type}\n\nWazz Ofc`
  const p = await new canvafy.Spotify()
    .setTitle(result.title)
    .setAuthor("Spotify - Downloader")
    .setTimestamp(40, 100)
    .setOverlayOpacity(0.8)
    .setBorder("#fff", 0.8)
    .setImage(result.image)
    .setBlur(3)
    .build();

  await dave.sendMessage(from,
  {
    image: p,
    caption: captionvid
  },
  {
    quoted: m
  })
  dave.sendMessage(m.chat,
  {
    audio:
    {
      url: result.download
    },
    mimetype: 'audio/mpeg',
    filename: 'MP3 BY ' + 'month wazz'
  },
  {
    quoted: m
  });
}
db.users[m.sender].exp += 300;
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
case 'profilegc':
case 'gcpp':      
case  'getppgc':
if (!isGroup) return 
reply(mess.wait)
try {
var ppimg = await dave.profilePictureUrl(m.chat, 'image')
} catch (err) {
console.log(err)
var ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}
await dave.sendMessage(m.chat, { image: { url: ppimg }}, { quoted: m })
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
 case 'link': case 'linkgc':{
if (!isBot && !isAdmins) return reply(` The command is for group only`)
if (!m.isGroup) return reply(mess.only.group)
if (!isBotAdmins) return reply(`Bot must Be Admin to eliminate the command`)
let response = await dave.groupInviteCode(m.chat)
dave.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`, m, { detectLink: true })
}
break;
        
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//      
        
         
        case 'poll': {
	if (!isBot) return m.reply(mess.owner)
            let [poll, opt] = text.split("|")
            if (text.split("|") < 2)
                return await reply(
                    `Mention question and atleast 2 options\nExample: ${prefix}poll Who is best admin?|dave,pesh,Med...`
                )
            let options = []
            for (let i of opt.split(',')) {
                options.push(i)
            }
            await dave.sendMessage(m.chat, {
                poll: {
                    name: poll,
                    values: options
                }
            })
        }
        break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//        
        
case 'add':
                if (!m.isGroup) return m.reply(mess.group)
                if(!isBot) return m.reply(mess.owner)
                if (!isBotAdmins) return reply(mess.admin)
                let blockwwww = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await dave.groupParticipantsUpdate(m.chat, [blockwwww], 'add')
                m.reply(mess.done)
                break; 
        
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
 case 'infogc': {
if(!isGroup) return reply("The command for groups only")
let _meta = await dave.groupMetadata(m.chat)
console.log(_meta)
let _img = await dave.profilePictureUrl(_meta.id, 'image') 
let caption = `${_meta.subject} - Created on ${moment(_meta.creation * 1000).format('ll')}\n\n` +
`*${_meta.participants.length}* Total Members\n*${_meta.participants.filter(x => x.admin === 'admin').length}* Admin\n*${_meta.participants.filter(x => x.admin === null).length}* Not Admin\n\n` +
`Group ID : ${_meta.id}`
await dave.sendMessage(m.chat,{
caption,
image: await getBuffer(_img)
},
{ quoted: m }
)
}
break;
        
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'delete': case 'del': case 'd': {
				if (!m.quoted) return m.reply('Reply message you want to delete')
				await dave.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: m.isBotAdmin ? false : true, id: m.quoted.id, participant: m.quoted.sender }})
			}
			break
   //=====================================================\\                    
//========================================================\\
   case "disp-7": { 
                 if (!m.isGroup) return reply (mess.group); 
                 
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 7*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 7 days!'); 
  
 } 
 break;

//========================================================\\
case 'listonline': case 'liston': {
    if (!m.isGroup) return m.reply(mess.group)

    let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat

    // Get group metadata (list of participants)
    let groupMetadata = await dave.groupMetadata(id)
    let participants = groupMetadata.participants.map(p => p.id)

    // If store.presences exists, try to detect who is typing
    let typingUsers = []
    if (store.presences && store.presences[id]) {
        typingUsers = Object.keys(store.presences[id])
            .filter(v => store.presences[id][v]?.lastKnownPresence === 'composing')
    }

    let textList = '👥 *Group Members:*\n\n' +
        participants.map(p => {
            let isTyping = typingUsers.includes(p) ? ' ⌨️ (typing...)' : ''
            return `@${p.split('@')[0]}${isTyping}`
        }).join('\n')

    await dave.sendMessage(m.chat, { text: textList, mentions: participants }, { quoted: m })
}
break
    
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
     case 'setnamegc':
     case 'setgroupname':
     case 'setsubject':
                if (!m.isGroup) return m.reply(mess.group)
                if (!isAdmins && !isGroupAdmins && !isBot) return reply(mess.admin)
                if (!isBotAdmins) return m.reply(mess.admin)
                if (!text) return reply('Text ?')
                await dave.groupUpdateSubject(m.chat, text)
                m.reply(mess.done)
                break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
        
 case "leave": case "leavegc": {
if (!isBot) return m.reply("Owner Command dude 🙃")
if (!isGroup) return m.reply("The command is for Group only.")
await m.reply("Successfully left the group by DAVE-MD\nMessage : _it was nice being here..._")
await sleep(2000)
await dave.groupLeave(m.chat)
}
break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//      
        
 case 'restart':
if (!isBot) return m.reply(mess.owner)
if (text) return
m.reply(`𝙳𝙰𝚅𝙴-𝙼𝙳 is restarting...`)
m.reply(mess.sucess)
await sleep(1500)
process.exit()
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
 case "toroundvideo":      
 case "toptv": {
if (/video/.test(qmsg.mimetype)) {
if ((qmsg).seconds > 30) return reply("maximum video duration 30 seconds!")
let ptv = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({ ptvMessage: qmsg }), { userJid: m.chat, quoted: m })
dave.relayMessage(m.chat, ptv.message, { messageId: ptv.key.id })
} else { 
return reply("Reply to a video content.")
}
}
break;
  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "laliga":
case "pd-table": {
  try {
    const data = await fetchJson('https://api.dreaded.site/api/standings/PD');
    const standings = data.data;
    const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗮𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀:-\n\n${standings}`;
    await m.reply(message);
  } catch (error) {
    m.reply('Something went wrong. Unable to fetch 𝗟𝗮𝗹𝗶𝗴𝗮 standings.');
  }
}
break;

//========================================================================================================================//
case "bundesliga":
case "bl-table": {
  try {
    const data = await fetchJson('https://api.dreaded.site/api/standings/BL1');
    const standings = data.data;
    const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
    await m.reply(message);
  } catch (error) {
    m.reply('Something went wrong. Unable to fetch 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 standings.');
  }
}
break;

//======================================================//
case "ligue-1":
case "lg-1": {
  try {
    const data = await fetchJson('https://api.dreaded.site/api/standings/FL1');
    const standings = data.data;
    const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗶𝗴𝘂𝗲-1 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
    await m.reply(message);
  } catch (error) {
    m.reply('Something went wrong. Unable to fetch 𝗹𝗶𝗴𝘂𝗲-1 standings.');
  }
}
break;

//========================================================================================================================//
case "serie-a":
case "sa-table": {
  try {
    const data = await fetchJson('https://api.dreaded.site/api/standings/SA');
    const standings = data.data;
    const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝗲𝗿𝗶𝗲-𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
    await m.reply(message);
  } catch (error) {
    m.reply('Something went wrong. Unable to fetch 𝗦𝗲𝗿𝗶𝗲-𝗮 standings.');
  }
}
break;

//==================================================//

case "enc": case "obf": {
	const Obf = require("javascript-obfuscator");

    // Check if the quoted message has text
    if (m.quoted && m.quoted.text) {
        const forq = m.quoted.text;

        // Obfuscate the JavaScript code
        const obfuscationResult = Obf.obfuscate(forq, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        });

        console.log("Successfully encrypted the code");
        m.reply(obfuscationResult.getObfuscatedCode());
    } else {
        m.reply("Quote/Tag a valid JavaScript code to encrypt!");
    }
}
	break;
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//      
case 'listblock':{
if (!isBot) return m.reply(mess.owner)
let block = await dave.fetchBlocklist()
reply('List Block :\n\n' + `Total : ${block == undefined ? '*0* BLOCKED NUMBERS' : '*' + block.length + '* Blocked Contacts'}\n` + block.map(v => '🩸 ' + v.replace(/@.+/, '')).join`\n`)
}
break;



//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "tourl": { 
  // Check if the message is a quoted image
  if (!m.quoted) return reply("Reply to an image with /tourlpub");

  // Download the quoted image
  let q = await m.quoted.download();
  if (!q) return reply("Failed to download image");

  // Create a new FormData object and append the image
  const FormData = require("form-data"),
    axios = require("axios"),
    form = new FormData();
  form.append("key", "LutBotz.Tamvan.dan.ganteng.banget.sumpah");
  form.append("file", q, { filename: "wa.png", contentType: "image/png" });

  // Send a POST request to the upload URL
  const r = await axios.post("https:")                                                                                      
  const z = r.data;

  if (!z.success) return reply("//rismajaya.my.id/tools/uploaders/uploads.php", form, { headers: form.getHeaders() });
  const d = r.data;

  // Check if the upload was successful
  if (!d.success) return reply("Upload failed: " + d.error);

  // Send the public link
  await reply(`Public link created successfully:\n\n${d.url}`);
}
break;
//==================================================//   
        case 'youtubemp4': {
  const axios = require('axios');
  const input = text?.trim();
  if (!input) return reply(`play:\n.ytmp4 https://youtu.be/xxxx,720\n\nList for results:\n- 360\n- 480\n- 720\n- 1080`);
  const [url, q = '720'] = input.split(',').map(a => a.trim());
  const validUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  if (!validUrl) return reply(`❌ URL YouTube is not valid!`);
  const qualityMap = {
    "360": 360,
    "480": 480,
    "720": 720,
    "1080": 1080
  };

  if (!qualityMap[q]) {
    return reply(`❌ Quality must be valid!\nexample: 360, 720, 1080`);
  }
  const quality = qualityMap[q];
  const sendResult = async (meta) => {
    await dave.sendMessage(m.chat, {
      image: { url: meta.image },
      caption: `✅ *Title:* ${meta.title}\n📥 *Type:* MP4\n🎚️ *Quality:* ${meta.quality}p\n\nSending  file...`,
    }, { quoted: m });
    await dave.sendMessage(m.chat, {
      document: { url: meta.downloadUrl },
      mimetype: 'video/mp4',
      fileName: `${meta.title}.mp4`
    }, { quoted: m });
  };

  try {
    const { data: start } = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${quality}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`,
      {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    );
    if (!start.progress_url) return m.reply(`❌ failed to start progress`);
    let progressUrl = start.progress_url;
    let meta = {
      image: start.info?.image || "https://telegra.ph/file/fd0028db8c3fc25d85726.jpg",
      title: start.info?.title || "Unknown Title",
      downloadUrl: "",
      quality: q,
      type: "mp4"
    };
    let polling, attempts = 0;
    const maxTry = 40;
    reply('⏳ processing video...');
    do {
      if (attempts >= maxTry) return reply(`❌ Timeout process!`);
      await new Promise(r => setTimeout(r, 3000));
      try {
        const { data } = await axios.get(progressUrl, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        });
        polling = data;
        if (polling.progress < 100) console.log(`Progress: ${polling.progress}%`);
      } catch (e) {
        console.log(`Polling ${attempts + 1} gagal`);
      }
      attempts++;
    } while (!polling?.download_url);
    if (!polling.download_url) return reply(`❌ failed to get download from the link`);
    meta.downloadUrl = polling.download_url;
    return await sendResult(meta);
  } catch (e) {
    console.error(e);
    return reply(`❌ error has occurred: ${e.message || 'err'}`);
  }
}
break
//==================================================//   

case 'translated':{
  	if (!q) return m.reply(`*Where is the text*\n\n*𝙴xample usage*\n*${prefix + command} <language id> <text>*\n*${prefix + command} ja yo wassup*`)
  	const defaultLang = 'en'
const tld = 'cn'
    let err = `
 *Example:*

*${prefix + command}* <id> [text]
*${prefix + command}* en Hello World

≡ *List of supported languages:* 
https://cloud.google.com/translate/docs/languages
`.trim()
    let lang = args[0]
    let text = args.slice(1).join(' ')
    if ((args[0] || '').length !== 2) {
        lang = defaultLang
        text = args.join(' ')
    }
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    try {
       let result = await translate(text, { to: lang, autoCorrect: true }).catch(_ => null) 
       reply(result.text)
    } catch (e) {
        return m.reply(err)
    } 
    }
    break
//========================================================\\

case 'trt': case 'trans': {
    try {
        const args = text.split(' ');
        if (args.length < 2) return m.reply("Please provide a language code and text to translate!");

        const targetLang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`);

        if (!response.ok) return m.reply('Failed to fetch data. Please try again later.');

        const data = await response.json();
        if (!data.responseData || !data.responseData.translatedText) return m.reply('No translation found for the provided text.');

        const translatedText = data.responseData.translatedText;
        const message = `${translatedText}`;

        // 🔥 dave → dave
        await dave.sendMessage(m.chat, { text: message }, { quoted: m });

    } catch (error) {
        console.error("Error occurred:", error);
        m.reply('An error occurred while fetching the data. Please try again later.\n' + error);
    }
}
break;

//========================================================================================================================//

case 'cast': {
    if (!Owner) throw NotOwner;
    if (!m.isGroup) throw group;
    if (!text) return m.reply(`Provide a text to cast!`);

    let mem = participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
    m.reply(`Success in casting the message to contacts.\n\nDo not always use this command to avoid WA bans!`);

    for (let pler of mem) {
        // 🔥 dave → dave
        await dave.sendMessage(pler, { text: q });
    }

    m.reply(`Casting completed successfully 😁`);
}
break;

//========================================================================================================================//

case "img": case "ai-img": case "image": case "images": {
    const gis = require('g-i-s');
    if (!text) return m.reply("Provide a text");

    try {
        gis(text, async (error, results) => {
            if (error) return m.reply("An error occurred while searching for images.\n" + error);
            if (results.length === 0) return m.reply("No images found.");

            const numberOfImages = Math.min(results.length, 5);
            const imageUrls = results.slice(0, numberOfImages).map(result => result.url);

            for (const url of imageUrls) {
                // 🔥 dave → dave
                await dave.sendMessage(m.chat, {
                    image: { url },
                    caption: `𝙳𝙰𝚅𝙴-𝙼𝙳 is on fire 🔥`
                }, { quoted: m });
            }
        });
    } catch (e) {
        m.reply("An error occurred.\n" + e);
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case "url": {
if (!/image/.test(mime)) return m.reply(example("tag/reply photo"))
let media = await dave.downloadAndSaveMediaMessage(qmsg)
const { ImageUploadService } = require('node-upload-images')
const service = new ImageUploadService('pixhost.to');
let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'skyzopedia.png');

let teks = directLink.toString()
await dave.sendMessage(m.chat, {text: teks}, {quoted: m})
await fs.unlinkSync(media)
}
break
//========================================================\\
case 'anime': {
if (!text) return m.reply(`Which anime are you lookin for?`)
const malScraper = require('mal-scraper')
await m.reply("wait.....")
        const anime = await malScraper.getInfoFromName(text).catch(() => null)
        if (!anime) return m.reply(`Could not find`)
let animetxt = `
🎀 *Title: ${anime.title}*
🎋 *Type: ${anime.type}*
🎐 *Premiered on: ${anime.premiered}*
💠 *Total Episodes: ${anime.episodes}*
📈 *Status: ${anime.status}*
💮 *Genres: ${anime.genres}
📍 *Studio: ${anime.studios}*
🌟 *Score: ${anime.score}*
💎 *Rating: ${anime.rating}*
🏅 *Rank: ${anime.ranked}*
💫 *Popularity: ${anime.popularity}*
♦️ *Trailer: ${anime.trailer}*
🌐 *URL: ${anime.url}*
❄ *Description:* ${anime.synopsis}*`
                await dave.sendMessage(m.chat,{image:{url:anime.picture}, caption:animetxt},{quoted:m})
                }
                break
//========================================================\\

//========================================================\\

case 'bible': {
  try {
    let chapterInput = m.text.split(' ').slice(1).join('').trim();
    if (!chapterInput) {
      return m.reply(`📖 Please specify a chapter or verse.\nExample: *${prefix + command} john 3:16*`);
    }

    chapterInput = encodeURIComponent(chapterInput);
    const chapterRes = await fetch(`https://bible-api.com/${chapterInput}`);
    if (!chapterRes.ok) {
      return m.reply(`⚠️ Could not find that verse. Example: *${prefix + command} john 3:16*`);
    }

    const chapterData = await chapterRes.json();
    const translatedEnglish = await translate(chapterData.text, { to: 'en' });
    const translatedHindi = await translate(chapterData.text, { to: 'hi' });

    const bibleReply = `
📖 *The Holy Bible*

📜 *Reference:* ${chapterData.reference}
📖 *Translation:* ${chapterData.translation_name}
🔢 *Number of Verses:* ${chapterData.verses.length}

🟢 *English:*
${translatedEnglish.text}

🟡 *Hindi:*
${translatedHindi.text}
    `.trim();

    m.reply(bibleReply);
  } catch (error) {
    m.reply(`❌ Error: ${error.message}`);
  }
}
break;

// ==========================================================
// 🕌 Quran Command
// ==========================================================
case 'quran': {
  try {
    let surahInput = m.text.split(' ')[1];
    if (!surahInput) {
      return m.reply(`🕌 Please specify a surah number or name.\nExample: *${prefix + command} 1*`);
    }

    const surahListRes = await fetch('https://quran-endpoint.vercel.app/quran');
    const surahList = await surahListRes.json();

    const surahData = surahList.data.find(
      surah =>
        surah.number === Number(surahInput) ||
        surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() ||
        surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    );

    if (!surahData) {
      return m.reply(`⚠️ Could not find surah: *${surahInput}*`);
    }

    const res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
    if (!res.ok) {
      const error = await res.json();
      return m.reply(`❌ API failed (status ${res.status}): ${error.message}`);
    }

    const json = await res.json();
    const translatedEnglish = await translate(json.data.tafsir.id, { to: 'en' });
    const translatedUrdu = await translate(json.data.tafsir.id, { to: 'ur' });

    const quranReply = `
🕌 *Quran: The Holy Book*

📜 *Surah ${json.data.number}:* ${json.data.asma.ar.long} (${json.data.asma.en.long})
📖 *Type:* ${json.data.type.en}
🔢 *Number of Verses:* ${json.data.ayahCount}

🟢 *Explanation (English):*
${translatedEnglish.text}

🔵 *Explanation (Urdu):*
${translatedUrdu.text}
    `.trim();

    await m.reply(quranReply);

    if (json.data.recitation.full) {
      await dave.sendMessage(
        m.chat,
        {
          audio: { url: json.data.recitation.full },
          mimetype: 'audio/mp4',
          ptt: true,
          fileName: `surah_${json.data.number}_recitation.mp3`
        },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error('QURAN CMD ERROR:', error);
    m.reply(`❌ Error: ${error.message}`);
  }
}
break;

//========================================================\\

case 'detiknews' : {
  if (!text) {
    return m.reply(`Provide a request.\n\nExample:\n.${command} ruu tni`)
  }

  try {
    const url = `https://www.detik.com/search/searchall?query=${encodeURIComponent(text)}`
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)

    let result = []
    $('.media__text').each((_, el) => {
      const media = $(el).find('h2').text().trim()
      const title = $(el).find('a').text().trim()
      const href = $(el).find('a').attr('href')
      const description = $(el).find('.media__desc').text().trim()

      if (title && href) {
        result.push({
          media,
          title,
          url: href,
          description
        })
      }
    })

    if (!result.length) return m.reply('❌ provide a valid request.')

    const list = result.slice(0, 10).map(item => {
      return `📰 *${item.title}*\n📌 ${item.media || 'Detik News'}\n🔗 ${item.url}`
    }).join('\n\n')

    await m.reply(`🔍 *Here are the latest news:*\n\n${list}`)
    
  } catch (e) {
    console.error(e)
    m.reply('⚠️ failed to get data.')
  }
}
break
//========================================================\\

case 'tostatus':
case 'story':
case 'upsw': {
    if (!Owner) return m.reply(mess.owner);

    if (quoted) {
        if (/audio/.test(mime)) {
            // 🎧 AUDIO
            const audiosw = await dave.downloadAndSaveMediaMessage(quoted);
            await dave.sendMessage('status@broadcast', {
                audio: { url: audiosw },
                mimetype: 'audio/mp4',
                ptt: true
            }, { upload: dave.waUploadToServer });
            return m.reply('✅ *𝙳𝙰𝚅𝙴-𝙼𝙳:* Audio uploaded to status 🎧');
        }
        if (/image/.test(mime)) {
            // 🖼️ IMAGE
            const imagesw = await dave.downloadAndSaveMediaMessage(quoted);
            await dave.sendMessage('status@broadcast', {
                image: { url: imagesw },
                caption: text || '🖼️ Posted via 𝙳𝙰𝚅𝙴-𝙼𝙳'
            }, { upload: dave.waUploadToServer });
            return m.reply('✅ *𝙳𝙰𝚅𝙴-𝙼𝙳:* Image uploaded to status 🖼️');
        }
        if (/video/.test(mime)) {
            // 🎥 VIDEO
            const videosw = await dave.downloadAndSaveMediaMessage(quoted);
            await dave.sendMessage('status@broadcast', {
                video: { url: videosw },
                caption: text || '🎥 Posted via 𝙳𝙰𝚅𝙴-𝙼𝙳'
            }, { upload: dave.waUploadToServer });
            return m.reply('✅ *𝙳𝙰𝚅𝙴-𝙼𝙳:* Video uploaded to status 🎥');
        }
    }

    // ✍️ TEXT (if no media)
    if (!text) return m.reply('⚠️ *𝙳𝙰𝚅𝙴-𝙼𝙳:* Provide text or reply to media!');
    await dave.sendMessage('status@broadcast', { 
        text 
    });
    m.reply('✅ *𝙳𝙰𝚅𝙴-𝙼𝙳:* Text status uploaded ✍️');
}
break;
//========================================================\\




case 'save': {
  try {
    const quotedMessage = m.msg?.contextInfo?.quotedMessage;
    
    // Check if user quoted a message
    if (!quotedMessage) {
      return m.reply('please reply to a status message');
    }
    
    // Verify it's a status message
    if (!m.quoted?.chat?.endsWith('@broadcast')) {
      return m.reply('that message is not a status! please reply to a status message.');
    }
    
    // Download the media first
    const mediaBuffer = await dave.downloadMediaMessage(m.quoted);
    if (!mediaBuffer || mediaBuffer.length === 0) {
      return m.reply('could not download the status media. it may have expired.');
    }
    
    // Determine media type and prepare payload
    let payload;
    let mediaType;
    
    if (quotedMessage.imageMessage) {
      mediaType = 'image';
      payload = {
        image: mediaBuffer,
        caption: quotedMessage.imageMessage.caption || 'saved status image',
        mimetype: 'image/jpeg'
      };
    } 
    else if (quotedMessage.videoMessage) {
      mediaType = 'video';
      payload = {
        video: mediaBuffer,
        caption: quotedMessage.videoMessage.caption || 'saved status video',
        mimetype: 'video/mp4'
      };
    } 
    else {
      return m.reply('only image and video statuses can be saved!');
    }
    
    // Send to user's DM
    await dave.sendMessage(
      m.sender, 
      payload,
      { quoted: m }
    );
    
    // Confirm in chat
    return m.reply(`${mediaType} 𝙳𝙰𝚅𝙴-𝙼𝙳 is on fire 🔥`);
    
  } catch (error) {
    console.error('Save error:', error);
    if (error.message.includes('404') || error.message.includes('not found')) {
      return m.reply('the status may have expired or been deleted.');
    }
    return m.reply('failed to save status. error: ' + error.message);
  }
}
break;
//==================================================//  


case 'toimage':
            case 'photo': {
                if (!/webp/.test(mime)) return reply(`Reply sticker with caption *${prefix + command}*`)
                await m.reply(`processing photo`)
                let media = await dave.downloadAndSaveMediaMessage(qmsg)
                let ran = await getRandom('.png')
                exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                    fs.unlinkSync(media)
                    if (err) return err
                    let buffer = fs.readFileSync(ran)
                    dave.sendMessage(m.chat, {
                        image: buffer
                    }, {
                        quoted: loli
                    })
                    fs.unlinkSync(ran)
                })

            }
            break
//========================================================\\          
case 'tomp4':
            case 'tovideo': {
                if (!/webp/.test(mime)) return m.reply(`Reply sticker with caption *${prefix + command}*`)
                await m.reply(`processing your video`)
                let media = await dave.downloadAndSaveMediaMessage(qmsg)
                let webpToMp4 = await webp2mp4File(media)
                await dave.sendMessage(m.chat, {
                    video: {
                        url: webpToMp4.result,
                        caption: 'Convert Webp To Video'
                    }
                }, {
                    quoted: loli
                })
                await fs.unlinkSync(media)

            }
            break
//========================================================\\        
        case "disp-90": { 
                 if (!m.isGroup) return reply (mess.group); 
                 
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 90*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 90 days!'); 
 } 
 break; 
//==================================================//         
        case "disp-off": { 
                 if (!m.isGroup) return reply (mess.group); 
             
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 0); 
 m.reply('Dissapearing messages successfully turned off!'); 
 }
   break;
       
//==================================================//  
        case "disp-1": { 
                 if (!m.isGroup) return reply (mess.group); 
                
                 if (!isAdmins) return reply (mess.admin); 
  
                     await dave.groupToggleEphemeral(m.chat, 1*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 24hrs!'); 
 } 
 break; 
//==================================================//  

//========================================================\\     

case "calculate":{
if (text.split("+")[0] && text.split("+")[1]) {
const nilai_one = Number(text.split("+")[0])
const nilai_two = Number(text.split("+")[1])
reply(`${nilai_one + nilai_two}`)
} else if (text.split("-")[0] && text.split("-")[1]) {
const nilai_one = Number(text.split("-")[0])
const nilai_two = Number(text.split("-")[1])
reply(`${nilai_one - nilai_two}`)
} else if (text.split("×")[0] && text.split("×")[1]) {
const nilai_one = Number(text.split("×")[0])
const nilai_two = Number(text.split("×")[1])
reply(`${nilai_one * nilai_two}`)
} else if (text.split("÷")[0] && text.split("÷")[1]) {
const nilai_one = Number(text.split("÷")[0])
const nilai_two = Number(text.split("÷")[1])
reply(`${nilai_one / nilai_two}`)
} else reply(`*Example* : ${prefix + command} 1 + 1`)
}
break
//==================================================// 

case "rvo": case "readviewonce": {
  try {
    if (!m.quoted) return m.reply("Reply to a view-once message.");

    let msg = m.quoted.message;
    let type = Object.keys(msg)[0];

    if (!msg[type].viewOnce) return m.reply("That message is not view-once!");

    // 1️⃣ Download the media
    let mediaStream = await downloadContentFromMessage(
      msg[type],
      type === "imageMessage" ? "image" : type === "videoMessage" ? "video" : "audio"
    );

    let buffer = Buffer.from([]);
    for await (const chunk of mediaStream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // 2️⃣ Prepare payload based on type
    let payload;
    if (/video/.test(type)) {
      payload = { video: buffer, caption: msg[type].caption || "" };
    } 
    else if (/image/.test(type)) {
      payload = { image: buffer, caption: msg[type].caption || "" };
    } 
    else if (/audio/.test(type)) {
      payload = { audio: buffer, mimetype: "audio/mpeg", ptt: true };
    } 
    else {
      return m.reply("Unsupported view-once message type.");
    }

    // 3️⃣ Send to DM (no confirmation message)
    await dave.sendMessage(m.sender, payload, { quoted: m });

  } catch (error) {
    console.error("RVO ERROR:", error);
    m.reply("❌ Failed to recover view-once message. Error: " + error.message);
  }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 


case "createqr": {
const qrcode = require('qrcode')
if (!text) return reply(`Wrong Usage Should Be ${prefix+command} Biiofc`)
const qyuer = await qrcode.toDataURL(text, { scale: 8 })
let data = new Buffer.from(qyuer.replace('data:image/png;base64,', ''), 'base64')
dave.sendMessage(from, { image: data, caption: `Success Sis` }, { quoted: kalgans })
}
break

//==================================================//     
       
         case 'cry': case 'kill': case 'hug': case 'pat': case 'lick': 
case 'kiss': case 'bite': case 'yeet': case 'bully': case 'bonk':
case 'wink': case 'poke': case 'nom': case 'slap': case 'smile': 
case 'wave': case 'awoo': case 'blush': case 'smug': case 'glomp': 
case 'happy': case 'dance': case 'cringe': case 'cuddle': case 'highfive': 
case 'shinobu': case 'handhold': {

axios.get(`https://api.waifu.pics/sfw/${command}`)
.then(({data}) => {
dave.sendImageAsSticker(from, data.url, m, { packname: global.packname, author: global.author })
})
}
break
//==================================================//         
        case 'woof':
case '8ball':
case 'goose':
case 'gecg':
case 'feed':
case 'avatar':
case 'fox_girl':
case 'lizard':
case 'spank':
case 'meow':
case 'tickle':{
                axios.get(`https://nekos.life/api/v2/img/${command}`)
.then(({data}) => {
dave.sendImageAsSticker(from, data.url, m, { packname: global.packname, author: global.author })
})
}
break
//==================================================//   
        case 'glitchtext':
case 'writetext':
case 'advancedglow':
case 'typographytext':
case 'pixelglitch':
case 'neonglitch':
case 'flagtext':
case 'flag3dtext':
case 'deletingtext':
case 'blackpinkstyle':
case 'glowingtext':
case 'underwatertext':
case 'logomaker':
case 'cartoonstyle':
case 'papercutstyle':
case 'watercolortext':
case 'effectclouds':
case 'blackpinklogo':
case 'gradienttext':
case 'summerbeach':
case 'luxurygold':
case 'multicoloredneon':
case 'sandsummer':
case 'galaxywallpaper':
case '1917style':
case 'makingneon':
case 'royaltext':
case 'freecreate':
case 'galaxystyle':
case 'lighteffects':{

if (!q) return reply(`Example : ${prefix+command} Trash corr`) 
let link
if (/glitchtext/.test(command)) link = 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html'
if (/writetext/.test(command)) link = 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html'
if (/advancedglow/.test(command)) link = 'https://en.ephoto360.com/advanced-glow-effects-74.html'
if (/typographytext/.test(command)) link = 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html'
if (/pixelglitch/.test(command)) link = 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html'
if (/neonglitch/.test(command)) link = 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html'
if (/flagtext/.test(command)) link = 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html'
if (/flag3dtext/.test(command)) link = 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html'
if (/deletingtext/.test(command)) link = 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html'
if (/blackpinkstyle/.test(command)) link = 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html'
if (/glowingtext/.test(command)) link = 'https://en.ephoto360.com/create-glowing-text-effects-online-706.html'
if (/underwatertext/.test(command)) link = 'https://en.ephoto360.com/3d-underwater-text-effect-online-682.html'
if (/logomaker/.test(command)) link = 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html'
if (/cartoonstyle/.test(command)) link = 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html'
if (/papercutstyle/.test(command)) link = 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html'
if (/watercolortext/.test(command)) link = 'https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html'
if (/effectclouds/.test(command)) link = 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html'
if (/blackpinklogo/.test(command)) link = 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html'
if (/gradienttext/.test(command)) link = 'https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html'
if (/summerbeach/.test(command)) link = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html'
if (/luxurygold/.test(command)) link = 'https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html'
if (/multicoloredneon/.test(command)) link = 'https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html'
if (/sandsummer/.test(command)) link = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html'
if (/galaxywallpaper/.test(command)) link = 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html'
if (/1917style/.test(command)) link = 'https://en.ephoto360.com/1917-style-text-effect-523.html'
if (/makingneon/.test(command)) link = 'https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html'
if (/royaltext/.test(command)) link = 'https://en.ephoto360.com/royal-text-effect-online-free-471.html'
if (/freecreate/.test(command)) link = 'https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html'
if (/galaxystyle/.test(command)) link = 'https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html'
if (/lighteffects/.test(command)) link = 'https://en.ephoto360.com/create-light-effects-green-neon-online-429.html'
let haldwhd = await ephoto(link, q)
dave.sendMessage(m.chat, { image: { url: haldwhd }, caption: `${mess.success}` }, { quoted: m })
}
break
//==================================================//        
        case 'truth':
              const truth =[
    "Have you ever liked anyone? How long?",
    "If you can or if you want, which gc/outside gc would you make friends with? (maybe different/same type)",
    "apa ketakutan terbesar kamu?",
    "Have you ever liked someone and felt that person likes you too?",
    "What is the name of your friend's ex-girlfriend that you used to secretly like?",
    "Have you ever stolen money from your father or mom? The reason?",
    "What makes you happy when you're sad?",
    "Ever had a one sided love? if so who? how does it feel bro?", 
    "been someone's mistress?",
    "the most feared thing",
    "Who is the most influential person in your life?",
    "what proud thing did you get this year", 
    "Who is the person who can make you awesome", 
    "Who is the person who has ever made you very happy?", 
    "Who is closest to your ideal type of partner here", 
    "Who do you like to play with??", 
    "Have you ever rejected people? the reason why?",
    "Mention an incident that made you hurt that you still remember", 
    "What achievements have you got this year??",
    "What's your worst habit at school??",
    "What song do you sing most in the shower",
    "Have you ever had a near-death experience",
    "When was the last time you were really angry. Why?",
    "Who is the last person who called you",
    "Do you have any hidden talents, What are they",
    "What word do you hate the most?",
    "What is the last YouTube video you watched?",
    "What is the last thing you Googled",
    "Who in this group would you want to swap lives with for a week",
    "What is the scariest thing thats ever happened to you",
    "Have you ever farted and blamed it on someone else",
    "When is the last time you made someone else cry",
    "Have you ever ghosted a friend",
    "Have you ever seen a dead body",
    "Which of your family members annoys you the most and why",
    "If you had to delete one app from your phone, which one would it be",
    "What app do you waste the most time on",
    "Have you ever faked sick to get home from school",
    "What is the most embarrassing item in your room",
    "What five items would you bring if you got stuck on a desert island",
    "Have you ever laughed so hard you peed your pants",
    "Do you smell your own farts",
    "have u ever peed on the bed while sleeping ??",
    "What is the biggest mistake you have ever made",
    "Have you ever cheated in an exam",
    "What is the worst thing you have ever done",
    "When was the last time you cried",
    "whom do you love the most among ur parents", 
    "do u sometimes put ur finger in ur nosetril?", 
    "who was ur crush during the school days",
    "tell honestly, do u like any boy in this grup",
    "have you ever liked anyone? how long?",
    "do you have gf/bf','what is your biggest fear?",
    "have you ever liked someone and felt that person likes you too?",
    "What is the name of your ex boyfriend of your friend that you once liked quietly?",
    "ever did you steal your mothers money or your fathers money",
    "what makes you happy when you are sad",
    "do you like someone who is in this grup? if you then who?",
    "have you ever been cheated on by people?",
    "who is the most important person in your life",
    "what proud things did you get this year",
    "who is the person who can make you happy when u r sad",
    "who is the person who ever made you feel uncomfortable",
    "have you ever lied to your parents",
    "do you still like ur ex",
    "who do you like to play together with?",
    "have you ever stolen big thing in ur life? the reason why?",
    "Mention the incident that makes you hurt that you still remember",
    "what achievements have you got this year?",
    "what was your worst habit at school?",
    "do you love the bot creator, xeon?ðŸ¤£",
    "have you ever thought of taking revenge from ur teacher?",
    "do you like current prime minister of ur country",
    "you non veg or veg",
    "if you could be invisible, what is the first thing you would do",
    "what is a secret you kept from your parents",
    "Who is your secret crush",
    "whois the last person you creeped on social media",
    "If a genie granted you three wishes, what would you ask for",
    "What is your biggest regret",
    "What animal do you think you most look like",
    "How many selfies do you take a day",
    "What was your favorite childhood show",
    "if you could be a fictional character for a day, who would you choose",
    "whom do you text the most",
    "What is the biggest lie you ever told your parents",
    "Who is your celebrity crush",
    "Whats the strangest dream you have ever had",
    "do you play pubg, if you then send ur id number"
]
              const xeontruth = truth[Math.floor(Math.random() * truth.length)]
              buffertruth = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
              dave.sendMessage(from, { image: buffertruth, caption: '_You choose TRUTH_\n'+ xeontruth }, {quoted:m})
              break
//==================================================//          
        case 'dare':
              const dare =[
    "eat 2 tablespoons of rice without any side dishes, if it's dragging you can drink",
    "spill people who make you pause",
    "call crush/pickle now and send ss",
    "drop only emote every time you type on gc/pc for 1 day.",
    "say Welcome to Who Wants To Be a Millionaire! to all the groups you have",
    "call ex saying miss",
    "sing the chorus of the last song you played",
    "vn your ex/crush/girlfriend, says hi (name), wants to call, just a moment. I miss you so much",
	"Bang on the table (which is at home) until you get scolded for being noisy",
    "Tell random people _I was just told I was your twin first, we separated, then I had plastic surgery. And this is the most ciyusss_ thing",
    "mention ex's name",
    "make 1 rhyme for the members!",
    "send ur whatsapp chat list",
    "chat random people with gheto language then ss here",
    "tell your own version of embarrassing things",
    "tag the person you hate",
    "Pretending to be possessed, for example: possessed by dog, possessed by grasshoppers, possessed by refrigerator, etc.",
    "change name to *I AM DONKEY* for 24 hours",
    "shout *ma chuda ma chuda ma chuda* in front of your house",
    "snap/post boyfriend photo/crush",
    "tell me your boyfriend type!",
    "say *i hv crush on you, do you want to be my girlfriend?* to the opposite sex, the last time you chatted (submit on wa/tele), wait for him to reply, if you have, drop here",
    "record ur voice that read *titar ke age do titar, titar ke piche do titar*",
    "prank chat ex and say *i love u, please come back.* without saying dare!",
    "chat to contact wa in the order according to your battery %, then tell him *i am lucky to hv you!*",
    "change the name to *I am a child of randi* for 5 hours",
    "type in bengali 24 hours",
    "Use selmon bhoi photo for 3 days",
    "drop a song quote then tag a suitable member for that quote",
    "send voice note saying can i call u baby?",
    "ss recent call whatsapp",
    "Say *YOU ARE SO BEAUTIFUL DON'T LIE* to guys!",
    "pop to a group member, and say fuck you",
    "Act like a chicken in front of ur parents",
    "Pick up a random book and read one page out loud in vn n send it here",
    "Open your front door and howl like a wolf for 10 seconds",
    "Take an embarrassing selfie and paste it on your profile picture",
    "Let the group choose a word and a well known song. You have to sing that song and send it in voice note",
    "Walk on your elbows and knees for as long as you can",
    "sing national anthem in voice note",
    "Breakdance for 30 seconds in the sitting roomðŸ˜‚",
    "Tell the saddest story you know",
    "make a twerk dance video and put it on status for 5mins",
    "Eat a raw piece of garlic",
    "Show the last five people you texted and what the messages said",
    "put your full name on status for 5hrs",
    "make a short dance video without any filter just with a music and put it on ur status for 5hrs",
    "call ur bestie, bitch",
    "put your photo without filter on ur status for 10mins",
    "say i love oli london in voice noteðŸ¤£ðŸ¤£",
    "Send a message to your ex and say I still like you",
    "call Crush/girlfriend/bestie now and screenshot here",
    "pop to one of the group member personal chat and Say you ugly bustard",
    "say YOU ARE BEAUTIFUL/HANDSOME to one of person who is in top of ur pinlist or the first person on ur chatlist",
    "send voice notes and say, can i call u baby, if u r boy tag girl/if girl tag boy",
    "write i love you (random grup member name, who is online) in personal chat, (if u r boy write girl name/if girl write boy name) take a snap of the pic and send it here",
    "use any bollywood actor photo as ur pfp for 3 days",
    "put your crush photo on status with caption, this is my crush",
    "change name to I AM GAY for 5 hours",
    "chat to any contact in whatsapp and say i will be ur bf/gf for 5hours",
    "send voice note says i hv crush on you, want to be my girlfriend/boyfriend or not? to any random person from the grup(if u girl choose boy, if boy choose girl",
    "slap ur butt hardly send the sound of slap through voice noteðŸ˜‚",
    "state ur gf/bf type and send the photo here with caption, ugliest girl/boy in the world",
    "shout bravooooooooo and send here through voice note",
    "snap your face then send it here",
    "Send your photo with a caption, i am lesbian",
    "shout using harsh words and send it here through vn",
    "shout you bastard in front of your mom/papa",
    "change the name to i am idiot for 24 hours",
    "slap urself firmly and send the sound of slap through voice noteðŸ˜‚",
    "say i love the bot owner xeon through voice note",
    "send your gf/bf pic here",
    "make any tiktok dance challenge video and put it on status, u can delete it after 5hrs",
    "breakup with your best friend for 5hrs without telling him/her that its a dare",
     "tell one of your frnd that u love him/her and wanna marry him/her, without telling him/her that its a dare",
     "say i love depak kalal through voice note",
     "write i am feeling horny and put it on status, u can delete it only after 5hrs",
     "write i am lesbian and put it on status, u can delete only after 5hrs",
     "kiss your mommy or papa and say i love youðŸ˜Œ",
     "put your father name on status for 5hrs",
     "send abusive words in any grup, excepting this grup, and send screenshot proof here"
]
              const xeondare = dare[Math.floor(Math.random() * dare.length)]
              bufferdare = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
              dave.sendMessage(from, { image: bufferdare, caption: '_You choose DARE_\n'+ xeondare }, {quoted:m})
              break
  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//     

case 'getbio':{
              try {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    else who = m.quoted.sender ? m.quoted.sender : m.sender
    let bio = await dave.fetchStatus(who)
    reply(bio.status)
  } catch {
    if (text) return reply(`bio is private or you haven't replied to the person's message!`)
    else try {
      let who = m.quoted ? m.quoted.sender : m.sender
      let bio = await dave.fetchStatus(who)
      reply(bio.status)
    } catch {
      return m.reply(`bio is private or you haven't replied to the person's message!`)
    }
  }
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//     
default:
if (budy.startsWith('>')) {
if (!isBot) return;
try {
let evaled = await eval(budy.slice(2));
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
await m.reply(evaled);
} catch (err) {
m.reply(String(err));
}
}

if (budy.startsWith('<')) {
if (!isBot) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await m.reply(require('util').format(teks))
}
}

}
} catch (err) {
console.log(require("util").format(err));
}
};

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
require('fs').unwatchFile(file);
console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
delete require.cache[file];
require(file);
});