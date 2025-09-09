require('./setting/settings');
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");
const axios = require('axios');
const didyoumean = require('didyoumean');
const path = require('path');
const chalk = require("chalk");
const util = require("util");
const moment = require("moment-timezone");
const speed = require('performance-now');
const similarity = require('similarity');
const { spawn, exec, execSync } = require('child_process');

const { downloadContentFromMessage, proto, generateWAMessage, getContentType, prepareWAMessageMedia, generateWAMessageFromContent, GroupSettingChange, jidDecode, WAGroupMetadata, emitGroupParticipantsUpdate, emitGroupUpdate, generateMessageID, jidNormalizedUser, generateForwardMessageContent, WAGroupInviteMessageGroupMetadata, GroupMetadata, Headers, delay, WA_DEFAULT_EPHEMERAL, WADefault, getAggregateVotesInPollMessage, generateWAMessageContent, areJidsSameUser, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWaconnet, makeInMemoryStore, MediaType, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, initInMemoryKeyStore, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WAMediaUpload, mentionedJid, processTime, Browser, MessageType,
Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, DisconnectReason, WAconnet, getStream, WAProto, isBaileys, AnyMessageContent, templateMessage, InteractiveMessage, Header } = require("@whiskeysockets/baileys");

module.exports = supreme = async (supreme, m, chatUpdate, store) => {
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
? supreme.user.id.split(":")[0] || supreme.user.id
: m.key.participant || m.key.remoteJid;

const senderNumber = sender.split('@')[0];
const budy = (typeof m.text === 'string' ? m.text : '');
const prefa = ["", "!", ".", ",", "🐤", "🗿"];
const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi) : '/';

// Buat Grup
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");

// Database And Lain"
const botNumber = await supreme.decodeJid(supreme.user.id);
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
const groupMetadata = isGroup ? await supreme.groupMetadata(m.chat).catch((e) => {}) : "";
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
supreme.sendMessage(from, { text : teks }, { quoted : m })
}

const reaction = async (jidss, emoji) => {
supreme.sendMessage(jidss, { react: { text: emoji, key: m.key }})}


if (global.autoTyping) {
  supreme.sendPresenceUpdate("composing", from);
}

if (global.autoRecording) {
  supreme.sendPresenceUpdate("recording", from);
}

supreme.sendPresenceUpdate("unavailable", from);

if (global.autorecordtype) {
  let xeonRecordTypes = ["recording", "composing"];
  let selectedRecordType = xeonRecordTypes[Math.floor(Math.random() * xeonRecordTypes.length)];
  supreme.sendPresenceUpdate(selectedRecordType, from);
}

if (autobio) {
  supreme.updateProfileStatus(`𝙳𝙰𝚅𝙴-𝙼𝙳 𝙱𝙾𝚃 is Active| |Runtime ${runtime(process.uptime())}`)
    .catch(err => console.error("Error updating status:", err));
}

if (m.sender.startsWith("92") && global.anti92 === true) {
  return supreme.updateBlockStatus(m.sender, "block");
}

if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(global.owner + "@s.whatsapp.net")) {
  if (!m.quoted) {
    reply("Owner is currently offline, please wait for a response");
    setTimeout(() => {
      supreme.sendMessage(m.key.remoteJid, { delete: m.key });
    }, 2000);
  }
}


 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
switch (command) {        
case "public": { 
if (!isBot) return reply(`Feature for owner only`)
supreme.public = true
reply(`Successfully✅ Changed Bot Mode To Public`)
}
break;


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case "self":
case "private": { 
if (!isBot) return reply(`Feature for owner only`)
supreme.public = false
reply(`Successfully✅ Changed Bot Mode To Private`)
}
break;

        
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        case 'autotyping':
                if (!isBot) return reply(mess.owner)
        
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
        
                if (q === 'on') {

                    autoTyping = true

                    reply(`Successfully ✅changed auto-typing to ${q}`)

                } else if (q === 'off') {

                    autoTyping = false

                    reply(`Successfully ✅changed auto-typing to ${q}`)

                }

                break;
                
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        case 'autorecording':
                
                if (!isBot) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    autoRecording = true

                    reply(`Successfully ✅changed auto-recording to ${q}`)

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

 //========================================================\\     
    
                          
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
  //========================================================\\  
                 
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
  //========================================================\\              


========================================================\\ 
  
  case "tts": {
  if(!text) return m.reply("`provide a query`");
  m.reply(`processing your query`);
  try {
    let anu = `https://api.siputzx.my.id/api/tools/tts?text=${encodeURIComponent(text)}&voice=jv-ID-DimasNeural&rate=0%&pitch=0Hz&volume=0%`;
    const response = await axios.get(anu, {
      responseType: 'arraybuffer'
    });
    let buffer = response.data;
    
    dave.sendMessage(m.chat, {
      audio: buffer,
      mimetype: "audio/mpeg",
      ptt: true
    })
  } catch (err) {
    console.log(err);
    return err;
  }
}
break;

 //========================================================\\     
                
                      
case "notes": case "tulis": {
  if (!text) return m.reply('❌provide a text .\n\nExample: nulis Biyu Tamvan');
  
  m.reply(`process.....`);
  const axios = require('axios');
  let apiUrl = `https://nirkyy.koyeb.app/api/v1/nulis?text=${encodeURIComponent(text)}`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    dave.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: `📝 *Success* 📝\n\n📌 *Text:* ${text}`
    }, { quoted: m });
  } catch (error) {
    console.log(error);
    m.reply(`❌ Error\nLogs error : ${error.message}`);
  }
}
break

 //========================================================\\    

case "dev":
case "developer":
case "botowner":
case "vowner": {
  let namaown = `Dave`
  let NoOwn = `254104260236`
  var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    contactMessage: {
      displayName: namaown,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:${namaown}\nitem1.TEL;waid=${NoOwn}:+${NoOwn}\nitem1.X-ABLabel:Mobile\nX-WA-BIZ-DESCRIPTION:Official Developer\nX-WA-BIZ-NAME:${namaown}\nEND:VCARD`
    }
  }), {
    userJid: m.chat,
    quoted: fkontak
  })
  dave.relayMessage(m.chat, contact.message, {
    messageId: contact.key.id
  })
}
break
        

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
  
    
  //========================================================\\    
    
     
       
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
    
       
case 'play2': {
    if (args.length === 0) return dave.sendMessage(m.chat, { text: `which song from YouTube do you want to download?, example:\nplay dj kane` }, { quoted: m });

    const query = args.join(' ');
    const axios = require('axios');
    const yts = require('yt-search');

    try {
        const search = await yts(query);
        if (!search || search.all.length === 0) return dave.sendMessage(m.chat, { text: 'Lagu yang Anda cari tidak ditemukan.' }, { quoted: m });

        const video = search.all[0];
        const detail = `* Youtube Audio Play*

*❖ Title* : ${video.title}
*❖ Views* : ${video.views}
*❖ Artist* : ${video.author.name}
*❖ Period* : ${video.ago}
*❖ URL* : ${video.url}
_processing audio..._`;

        await dave.sendMessage(m.chat, { text: detail }, { quoted: m });

        const format = 'mp3';
        const url = `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(video.url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.data || !response.data.success) return dave.sendMessage(m.chat, { text: 'audio.' }, { quoted: m });

        const { id, title, info } = response.data;
        const { image } = info;

        while (true) {
            const progress = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (progress.data && progress.data.success && progress.data.progress === 1000) {
                const downloadUrl = progress.data.download_url;

                await dave.sendMessage(m.chat, {
                    audio: { url: downloadUrl },
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: m });
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('Error:', error);
        dave.sendMessage(m.chat, { text: 'Could not find your song.' }, { quoted: loli });
    }
}
break;


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
      return m.reply("Logo Data");
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

    await supreme.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: m }).catch((err) => reply("error"))

		    }
	      break; 
	      
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//	           
 
case "uptime":
 case 'runtime': { 

         reply (`━━━━━━━━━━━━━━━━━\n\◉‿◉Welcome ${m.pushName}\n\━━━━━━━━━━━━━━━━━\n\*💚 𝗱𝗮𝘃𝗲 has been running for*  : ${runtime(process.uptime())} \n\━━━━━━━━━━━━━━━━━`); 
}
break;
   
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
     

 case 'autobio':
  if (!isBot) return reply(mess.owner)
  if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
  if (q === 'on') {
    autobio = true
    reply(`Auto-bio Successfully✅ changed to ${q}`)
  } else if (q === 'off') {
    autobio = false
    reply(`Auto-bio Successfully✅ changed to ${q} `)
  }
  break;  
           
        
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//    

case "ai":
case "gpt":
 if (!args.length) {
 return m.reply("provide a question .\n\nExample: *who is Ronaldo?*");
 }
 let query = encodeURIComponent(args.join(" "));
 let apiUrl3 = `https://www.laurine.site/api/ai/heckai?query=${query}`;
 try {
 let response = await fetch(apiUrl3);
 let data = await response.json();
 if (!data.status || !data.data) {
 return reply("❌ AI is inactive.");
 }
 m.reply(`🤖 *AI Response:*\n\n${data.data}`);
 } catch (error) {
 console.error(error);
 m.reply("❌ errror.");
 }
 break
 
  //====================================================\\ 


            
case 'calender': case 'createcalender': {
    let args = text.split(' ');
    if (args.length < 2) return m.reply('wrong format! Use: ckalender month year');
    let month = args[0];
    let year = args[1];
    if (isNaN(month) || isNaN(year)) return m.reply('provide a correct format!');
    let apiUrl = `https://fastrestapis.fasturl.cloud/maker/calendar/simple?month=${month}&year=${year}`;
    dave.sendMessage(m.chat, { image: { url: apiUrl }, caption: `Kalender month ${month} year ${year}` }, { quoted: loli });
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

 /*  case 'chanelid': case 'idch': {
if (!text) return reply("example : link channel")
if (!text.includes("https://whatsapp.com/channel/")) return reply("Link is not valid bro ")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await supreme.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Name :* ${res.name}
* *Follower:* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Verified" : "No"}
`
return reply(teks)
}
break;     */
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
  
  case 'p':
  const start = Date.now();
  const msg = await m.reply('⚡ checking speed...');
  const end = Date.now();
  const latency = end - start;
  m.reply(`𝙳𝙰𝚅𝙴-𝙼𝙳 speed: ${latency}ms`);
  break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
        
        
case 'play':{
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
              await supreme.sendMessage(
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
        
case 'profilegc':
case 'gcpp':      
case  'getppgc':
if (!isGroup) return 
reply(mess.wait)
try {
var ppimg = await supreme.profilePictureUrl(m.chat, 'image')
} catch (err) {
console.log(err)
var ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}
await supreme.sendMessage(m.chat, { image: { url: ppimg }}, { quoted: m })
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
 case 'link': case 'linkgc':{
if (!isBot && !isAdmins) return reply(` The command is for group only`)
if (!m.isGroup) return reply(mess.only.group)
if (!isBotAdmins) return reply(`Bot must Be Admin to eliminate the command`)
let response = await supreme.groupInviteCode(m.chat)
supreme.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`, m, { detectLink: true })
}
break;
        
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//      
        
         
        case 'poll': {
	if (!isBot) return m.reply(mess.owner)
            let [poll, opt] = text.split("|")
            if (text.split("|") < 2)
                return await reply(
                    `Mention question and atleast 2 options\nExample: ${prefix}poll Who is best admin?|Xeon,Cheems,Doge...`
                )
            let options = []
            for (let i of opt.split(',')) {
                options.push(i)
            }
            await supreme.sendMessage(m.chat, {
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
                await supreme.groupParticipantsUpdate(m.chat, [blockwwww], 'add')
                m.reply(mess.done)
                break; 
        
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
 case 'infogc': {
if(!isGroup) return reply("The command for groups only")
let _meta = await supreme.groupMetadata(m.chat)
console.log(_meta)
let _img = await supreme.profilePictureUrl(_meta.id, 'image') 
let caption = `${_meta.subject} - Created on ${moment(_meta.creation * 1000).format('ll')}\n\n` +
`*${_meta.participants.length}* Total Members\n*${_meta.participants.filter(x => x.admin === 'admin').length}* Admin\n*${_meta.participants.filter(x => x.admin === null).length}* Not Admin\n\n` +
`Group ID : ${_meta.id}`
await supreme.sendMessage(m.chat,{
caption,
image: await getBuffer(_img)
},
{ quoted: m }
)
}
break;
        
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
     case 'setnamegc':
     case 'setgroupname':
     case 'setsubject':
                if (!m.isGroup) return m.reply(mess.group)
                if (!isAdmins && !isGroupAdmins && !isBot) return reply(mess.admin)
                if (!isBotAdmins) return m.reply(mess.admin)
                if (!text) return reply('Text ?')
                await supreme.groupUpdateSubject(m.chat, text)
                m.reply(mess.done)
                break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
        
 case "leave": case "leavegc": {
if (!isBot) return m.reply("Owner Command dude 🙃")
if (!isGroup) return m.reply("The command is for Group only.")
await m.reply("Successfully left the group by DAVE-MD\nMessage : _it was nice being here..._")
await sleep(2000)
await supreme.groupLeave(m.chat)
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
supreme.relayMessage(m.chat, ptv.message, { messageId: ptv.key.id })
} else { 
return reply("Reply to a video content.")
}
}
break;
  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
        
case 'listblock':{
if (!isBot) return m.reply(mess.owner)
let block = await supreme.fetchBlocklist()
reply('List Block :\n\n' + `Total : ${block == undefined ? '*0* BLOCKED NUMBERS' : '*' + block.length + '* Blocked Contacts'}\n` + block.map(v => '🩸 ' + v.replace(/@.+/, '')).join`\n`)
}
break;



//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

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
    return m.reply(`${mediaType} saved by VENOM-XMD`);
    
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
