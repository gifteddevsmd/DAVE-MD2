
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

if (global.autobio) {
  dave.updateProfileStatus(`𝙳𝙰𝚅𝙴-𝙼𝙳 is Online✅ | |Runtime ${runtime(process.uptime())}`)
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
switch (command) {        
case "public": { 
  if (!isBot) return reply(`Feature for owner only`)
  dave.public = true
  reply(`Successfully Changed Bot Mode To Public`)
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case "self":
case "private": { 
  if (!isBot) return reply(`command reserved for owner only`)
  dave.public = false
  reply(`Successfully Changed bot mode to Private`)
}
break;

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
      reply(`Successfully changed autorecording to ${q}`)
  } else if (q === 'off') {
      autoRecording = false
      reply(`Successfully changed autorecording to ${q}`)
  }
  break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
    case 'gitclone': {

		      if (!text) return dave(`provide  a github link.\n *Example:* .gitclone https://github.com/giftdee/DAVE-MD`)

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
    case 'uptime':
    case 'runtime': { 

         reply (`━━━━━━━━━━━━━━━━━\n\◉‿◉Welcome ${m.pushName}\n\━━━━━━━━━━━━━━━━━\n\*💚 𝗱𝗮𝘃𝗲 has been running for*  : ${runtime(process.uptime())} \n\━━━━━━━━━━━━━━━━━`); 
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 
       case 'bot':
case 'file': {
  const botInfo = `
╭─ ⌬ Bot Info
│ • Name    : ${botname}
│ • Owner   : ${ownername}
│ • Version  : ${botversion}
│ • Repo : gitHub.com/giftdee/VENOM-XMD/fork 
│ • Runtime  : ${runtime(process.uptime())}\n╰─────────────
`
  reply(botInfo)
}
break      
  
    
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
  
  
  
  
  case "rvo": case "readviewonce": {
if (!m.quoted) return reply("by replying to the message")
let msg = m.quoted.message
    let type = Object.keys(msg)[0]
if (!msg[type].viewOnce) return reply("That message is not viewonce!")
let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio')
    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (/video/.test(type)) {
        return dave.sendMessage(m.chat, {video: buffer, caption: msg[type].caption || ""}, {quoted: m})
    } else if (/image/.test(type)) {
        return dave.sendMessage(m.chat, {image: buffer, caption: msg[type].caption || ""}, {quoted: m})
    } else if (/audio/.test(type)) {
        return dave.sendMessage(m.chat, {audio: buffer, mimetype: "audio/mpeg", ptt: true}, {quoted: m})
    } 
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "gpass": case 'genpassword': {
  try {
    const length = args[0] ? parseInt(args[0]) : 12; // Default length is 12 if not provided
    if (isNaN(length) || length < 8) {
      return reply('Please provide a valid length for the password (Minimum 08 Characters).');
    }

    const generatePassword = (len) => {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
      let password = '';
      for (let i = 0; i < len; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
      }
      return password;
    };

    const password = generatePassword(length);
    const message = `Below is your password 🔥:`;

    // Send initial notification message
    await dave.sendMessage(from, { text: message }, { quoted: m });

    // Send the password in a separate message
    await dave.sendMessage(from, { text: password }, { quoted: m });

  } catch (e) {
    console.log(e);
    reply(`Error generating password🤕: ${e.message}`);
  }
}
break;


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 


case "translate": case "trt": {
let lang, text
if (args.length >= 2) {
lang = args[0] ? args[0] : 'id', text = args.slice(1).join(' ')
} else if (m.quoted && m.quoted.text) {
lang = args[0] ? args[0] : 'id', text = m.quoted.text
} else return reply(`Ex: ${prefix + command} id hello i am robot`)
const trans = require('@vitalets/google-translate-api')
await loading()
let res = await trans.translate(text, { to: lang, autoCorrect: true }).catch(_ => null)
if (!res) return reply(`Error : Language "${lang}" Not Supported`)
reply(`*Detected Language:* ${res.from?.language.iso}\n*To Language:* ${lang}\n\n*Translation:* ${res.text}`.trim())
}
break


  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
   
  
  case 'tovid': { 
                if (!quoted) return reply('Reply Image')
                if (!/webp/.test(mime)) return reply(`reply sticker with caption *${prefix + command}*`)
                reply(mess.wait)
		        let { webp2mp4File } = require('./lib/uploader')
                let media = await dave.downloadAndSaveMediaMessage(quoted)
                let webpToMp4 = await webp2mp4File(media)
                await dave.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' } }, { quoted: kalgans })
                await fs.unlinkSync(media)
            }
            break
 
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
             
                                  
case 'toimage': case 'toimg': { 
if (isBan) return reply2(mess.ban)
await loading()
if (!quoted) throw 'Reply Image'
if (!/webp/.test(mime)) throw `Reply sticker with caption *${prefix + command}*`
let media = await dave.downloadAndSaveMediaMessage(quoted)
let ran = await getRandom('.png')
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) throw err
let buffer = fs.readFileSync(ran)
dave.sendMessage(from, { image: buffer }, {quoted:kalgans})
fs.unlinkSync(ran)
})
}
break

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
  
    case 'bard': case 'gemini': case 'aiedit': {
    if (!isLimit) return dave.sendMessage(m.chat, {text: mess.limit}, {quoted: m})
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} What date is it now?`}, {quoted: m})
    if (!(APIKeys.geminiApikey?.length > 0 && APIKeys.geminiApikey?.some(a => a.trim() !== ''))) return dave.sendMessage(m.chat, {text: 'Please get the Apikey first at\nhttps://aistudio.google.com/app/apikey'}, {quoted: m})
    try {
        let apinya = pickRandom(APIKeys.geminiApikey)
        geminiAi(text, apinya, quoted.isMedia ? { mime: quoted.mime, media: await quoted.download() } : {}).then(a => {
            if (a.media) dave.sendMessage(m.chat, { 
                [a.mime.includes('image') ? 'image' : a.mime.includes('video') ? 'video' : 'document']: a.media,
                caption: a.text || ''
            }, {quoted: m})
            else if (a.text) dave.sendMessage(m.chat, {text: a.text}, {quoted: m})
        }).catch(e => {
            if (e.status === 503) dave.sendMessage(m.chat, {text: 'Gemini model is busy, please try again later...'}, {quoted: m})
            else if (e.status === 400) dave.sendMessage(m.chat, {text: 'API key not valid. Please pass a valid API key.'}, {quoted: m})
            else dave.sendMessage(m.chat, {text: 'Your apikey is limited or another error occurred!'}, {quoted: m})
        })
        setLimit(m, db)
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Your apikey is limited!\nPlease Replace with another apikey!'}, {quoted: m})
    }
}
break  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

   case "kill": 
case "kickmembers": {
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
   
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'islamic': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/IslamicQuotes.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch Islamic quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Islamic Quotes*\n\n${randomQuote}`;

        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching quotes:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a quotes.'}, {quoted: m});
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'pickup': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/PickupLines.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Pickup Lines*\n\n${randomQuote}`;

        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching pickup lines:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a pickup line.'}, {quoted: m});
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case "movie": {
    if (!text) return dave(`❌ Provide a movie or series name.`);  

    try {
        let fids = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(text)}&plot=full`);

        if (!fids.data || fids.data.Response === "False") {
            return dave(`⚠️ Movie/series not found.`);
        }

        let imdbt = `⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n` +
                    `🎬 *IMDB MOVIE SEARCH*\n` +
                    `⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n` +
                    `🎬 Title      : ${fids.data.Title}\n` +
                    `📅 Year       : ${fids.data.Year}\n` +
                    `⭐ Rated      : ${fids.data.Rated}\n` +
                    `📆 Released   : ${fids.data.Released}\n` +
                    `⏳ Runtime    : ${fids.data.Runtime}\n` +
                    `🌀 Genre      : ${fids.data.Genre}\n` +
                    `👨🏻‍💻 Director : ${fids.data.Director}\n` +
                    `✍ Writer     : ${fids.data.Writer}\n` +
                    `👨 Actors     : ${fids.data.Actors}\n` +
                    `📃 Plot       : ${fids.data.Plot}\n` +
                    `🌐 Language   : ${fids.data.Language}\n` +
                    `🌍 Country    : ${fids.data.Country}\n` +
                    `🎖️ Awards     : ${fids.data.Awards}\n` +
                    `📦 BoxOffice  : ${fids.data.BoxOffice}\n` +
                    `🏙️ Production : ${fids.data.Production}\n` +
                    `🌟 IMDbRating : ${fids.data.imdbRating}\n` +
                    `❎ IMDbVotes  : ${fids.data.imdbVotes}`;

        await dave.sendMessage(m.chat, {  
            image: { url: fids.data.Poster },  
            caption: imdbt  
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        dave("❌ An error occurred while fetching movie details.");
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case 'botpp': { 
    if (!Owner) throw NotOwner; 
    if (!quoted) throw `❌ 𝗧𝗮𝗴 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝘁𝗼 𝘀𝗲𝘁 𝗮𝘀 𝐃𝐀𝐕𝐄-𝐌𝐃 𝗯𝗼𝘁 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝗸.`;
    if (!/image/.test(mime)) throw `❌ 𝗧𝗮𝗴 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝘁𝗼 𝘀𝗲𝘁 𝗮𝘀 𝐃𝐀𝐕𝐄-𝐌𝐃 𝗯𝗼𝘁 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝗸.`; 
    if (/webp/.test(mime)) throw `❌ 𝗧𝗮𝗴 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝘁𝗼 𝘀𝗲𝘁 𝗮𝘀 𝐃𝐀𝐕𝐄-𝐌𝐃 𝗯𝗼𝘁 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝗸.`;

    let media = await dave.downloadAndSaveMediaMessage(quoted);
    
    await dave.updateProfilePicture(botNumber, { url: media }).catch((err) => fs.unlinkSync(media)); 

    dave("DAVE-𝐌𝐃 bot profile picture has been successfully updated!");
} 
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "Bois": { 
    if (!Owner) throw NotOwner; 
    if (!m.quoted && !text) throw `❌ 𝗧𝗮𝗴 𝘀𝗼𝗺𝗲𝗼𝗻𝗲 𝗳𝗼𝗿 𝗯𝗹𝗼𝗰𝗸𝗶𝗻𝗴!`;  

    let users = m.mentionedJid?.[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
            ? m.quoted.sender 
            : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net';

    if (users === "254104260236@s.whatsapp.net") 
        return dave("❌ 𝗜 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗹𝗼𝗰𝗸 𝗺𝘆 𝗢𝘄𝗻𝗲𝗿 😡");

    if (users === dave.decodeJid(dave.user.id)) 
        throw '❌ 𝗜 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗹𝗼𝗰𝗸 𝗺𝘆𝘀𝗲𝗹𝗳 😡';

    await dave.updateBlockStatus(users, 'block'); 
    dave(`✅ 𝗨𝘀𝗲𝗿 has been blocked successfully!`);
} 
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

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

        console.log("✅ Successfully encrypted the code");
        dave(`🔒 Encrypted Code:\n\n${obfuscationResult.getObfuscatedCode()}`);
    } else {
        dave("❌ Quote/Tag a valid JavaScript code to encrypt!");
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "setvar": {
    if (!Owner) throw NotOwner;
    if (!text.split('=')[1]) 
        return dave('❌ Incorrect Usage:\nProvide the key and value correctly\nExample: setvar AUTOVIEW_STATUS=TRUE');

    const herokuClient = new Heroku({ token: herokuapi });
    let baseURI = "/apps/" + appname;

    await herokuClient.patch(baseURI + "/config-vars", {
        body: {
            [text.split('=')[0]]: text.split('=')[1],
        },
    });

    dave(`✅ The variable ${text.split('=')[0]} = ${text.split('=')[1]} has been set successfully.\nWait 20s for changes to take effect!`);
}
break;

//========================================================================================================================//	

case "dlt": case "dil": {
    if (!m.quoted) throw `❌ No message quoted for deletion`;
    let { chat, fromMe, id, isBaileys } = m.quoted;
    if (isBaileys) throw `❌ I cannot delete. Quoted message is my message or another bot's message.`;
    
    await dave.sendMessage(m.chat, { 
        delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } 
    });

    dave('✅ Message deleted successfully.');
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "apk":
case "app": {
    if (!text) return dave("❌ Where is the app name?");
    try {
        const kyuu = await fetchJson(`https://bk9.fun/search/apk?q=${text}`);
        const tylor = await fetchJson(`https://bk9.fun/download/apk?id=${kyuu.BK9[0].id}`);

        await dave.sendMessage(
            m.chat,
            {
                document: { url: tylor.BK9.dllink },
                fileName: tylor.BK9.name,
                mimetype: "application/vnd.android.package-archive",
                contextInfo: {
                    externalAdReply: {
                        title: `𝐃𝐀𝐕𝐄-𝐌𝐃`,
                        body: `${tylor.BK9.name}`,
                        thumbnailUrl: `${tylor.BK9.icon}`,
                        sourceUrl: `${tylor.BK9.dllink}`,
                        mediaType: 2,
                        showAdAttribution: true,
                        renderLargerThumbnail: false
                    }
                }
            },
            { quoted: m }
        );
    } catch (err) {
        console.error(err);
        dave("❌ Failed to fetch or send the APK. Try again later.");
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "dp": { 
    try { 
        if (!m.quoted) throw `Tag a user!`; 
        const ha = m.quoted.sender; 
        const qd = await dave.getName(ha); 
        let pp2;
        try {
            pp2 = await dave.profilePictureUrl(ha, 'image'); 
        } catch {
            pp2 = 'https://tinyurl.com/yx93l6da'; 
        }
        const bar = `📸 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜𝐭𝐮𝐫𝐞 𝐨𝐟 ${qd}`;
        await dave.sendMessage(m.chat, { image: { url: pp2 }, caption: bar, fileLength: "999999999999" }, { quoted: m }); 
    } catch (err) {
        dave('❌ Could not fetch profile picture. Make sure you tagged a valid user.');
    }
} 
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "subject": case "changesubject": { 
    if (!m.isGroup) throw group; 
    if (!isBotAdmin) throw botAdmin; 
    if (!isAdmin) throw admin; 
    if (!text) throw 'Provide the text for the group subject.'; 

    await dave.groupUpdateSubject(m.chat, text); 
    dave('Group name successfully updated!'); 
} 
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
case "delete": case "del": { 
    if (!m.isGroup) throw group; 
    if (!isBotAdmin) throw botAdmin; 
    if (!isAdmin) throw admin; 
    if (!m.quoted) throw `No message quoted for deletion`; 

    let { chat, fromMe, id, isBaileys } = m.quoted; 
    if (isBaileys) throw `I cannot delete. Quoted message is my message or another bot message.`; 

    await dave.sendMessage(m.chat, { 
        delete: { 
            remoteJid: m.chat, 
            fromMe: false, 
            id: m.quoted.id, 
            participant: m.quoted.sender 
        } 
    });

    dave('✅ Message deleted successfully'); 
} 
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "icon": { 
    if (!m.isGroup) throw group; 
    if (!isAdmin) throw admin; 
    if (!isBotAdmin) throw botAdmin; 
    if (!quoted) throw `Send or tag an image with the caption ${prefix + command}`; 
    if (!/image/.test(mime)) throw `Send or tag an image with the caption ${prefix + command}`; 
    if (/webp/.test(mime)) throw `Send or tag an image with the caption ${prefix + command}`; 

    let media = await dave.downloadAndSaveMediaMessage(quoted); 
    await dave.updateProfilePicture(m.chat, { url: media }).catch((err) => fs.unlinkSync(media)); 
    dave('𝗚𝗿𝗼𝘂𝗽 𝗶𝗰𝗼𝗻 𝘂𝗽𝗱𝗮𝘁𝗲𝗱 ✅'); 
} 
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case 'closetime': {
    if (!m.isGroup) throw group;
    if (!isAdmin) throw admin;
    if (!isBotAdmin) throw botAdmin;

    let timer;
    if (args[1] === 'second') timer = args[0] * 1000;
    else if (args[1] === 'minute') timer = args[0] * 60000;
    else if (args[1] === 'hour') timer = args[0] * 3600000;
    else if (args[1] === 'day') timer = args[0] * 86400000;
    else return dave('*Select a unit:*\nsecond\nminute\nhour\nday\n\n*Example:*\n10 second');

    dave(`Countdown of ${q} starting from now to close the group`);

    setTimeout(async () => {
        await dave.groupSettingUpdate(m.chat, 'announcement');
        dave('𝗚𝗿𝗼𝘂𝗽 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗰𝗹𝗼𝘀𝗲𝗱 ✅');
    }, timer);
}
break;

//========================================================================================================================//		      
case 'opentime': {
    if (!m.isGroup) throw group;
    if (!isAdmin) throw admin;
    if (!isBotAdmin) throw botAdmin;

    let timer;
    if (args[1] === 'second') timer = args[0] * 1000;
    else if (args[1] === 'minute') timer = args[0] * 60000;
    else if (args[1] === 'hour') timer = args[0] * 3600000;
    else if (args[1] === 'day') timer = args[0] * 86400000;
    else return dave('*Select a unit:*\nsecond\nminute\nhour\nday\n\n*Example:*\n10 second');

    dave(`Countdown of ${q} starting from now to open the group`);

    setTimeout(async () => {
        await dave.groupSettingUpdate(m.chat, 'not_announcement');
        dave('𝗚𝗿𝗼𝘂𝗽 𝗼𝗽𝗲𝗻𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝗳𝘂𝗹𝗹𝘆 ✅');
    }, timer);
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "admin": { 
    if (!m.isGroup) throw group; 
    if (!isBotAdmin) throw botAdmin; 
    if (!Owner) throw NotOwner; 

    await dave.groupParticipantsUpdate(m.chat, [m.sender], 'promote'); 
    dave('Promoted To Admin 🥇'); 
}
break;

//========================================================================================================================//		      
case "getvar": {
    if (!Owner) throw NotOwner;  

    const heroku = new Heroku({  
        token: herokuapi, // Replace with your actual Heroku token 
    });  

    let baseUR = "/apps/" + appname;  
    let h9 = await heroku.get(baseUR + '/config-vars');  

    let stoy = '*𝗕𝗲𝗹𝗼𝘄 𝗔𝗿𝗲 𝗛𝗲𝗿𝗼𝗸𝘂 𝗩𝗮𝗿𝗶𝗮𝗯𝗹𝗲𝘀 𝗳𝗼𝗿 𝐃𝐀𝐕𝐄-𝐌𝐃:*\n\n';  

    for (const vrt in h9) {  
        stoy += `${vrt} = ${h9[vrt]}\n\n`;  
    }  

    dave(stoy); 
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case "inbox": {
    if (!text) return dave("To fetch messages from your mail, provide the email address which was issued.");

    const mail = encodeURIComponent(text);
    const checkMail = `https://tempmail.apinepdev.workers.dev/api/getmessage?email=${mail}`;

    try {
        const response = await fetch(checkMail);

        if (!response.ok) {
            return dave(`${response.status} error occurred while communicating with API.`);
        }

        const data = await response.json();

        if (!data || !data.messages) {
            return dave('I am unable to fetch messages from your mail, your inbox might be empty or some other error occurred.');
        }

        const messages = data.messages;

        for (const message of messages) {
            const sender = message.sender;
            const subject = message.subject;
            const date = new Date(JSON.parse(message.message).date).toLocaleString();
            const messageBody = JSON.parse(message.message).body;

            const mailMessage = `👥 Sender: ${sender}\n📝 Subject: ${subject}\n🕜 Date: ${date}\n📩 Message: ${messageBody}`;

            await dave(mailMessage);
        }
    } catch (error) {
        console.error('𝗢𝗼𝗽𝘀 𝗘𝗿𝗿𝗼𝗿!', error);
        return dave('𝗦𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴 𝗶𝘀 𝘄𝗿𝗼𝗻𝗴!');
    }
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "mail": {
    const { TempMail } = require("tempmail.lol");
    const tempmail = new TempMail();

    const inbox = await tempmail.createInbox();
    const emailMessage = `${inbox.address}`;

    await dave(emailMessage);

    const mas = await dave.sendMessage(m.chat, { text: `${inbox.token}` });

    await dave.sendMessage(
        m.chat, 
        { text: `Quoted text is your token. To fetch messages in your email use <.inbox your-token>` }, 
        { quoted: mas }
    );
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "system": {
  dave.sendMessage(m.chat, { 
    image: { url: 'https://files.catbox.moe/s5nuh3.jpg' }, 
    caption: `*𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: 𝐃𝐀𝐕𝐄-𝐌𝐃*\n\n*𝐒𝐏𝐄𝐄𝐃: ${Rspeed.toFixed(4)} 𝐌𝐒*\n\n*𝐑𝐔𝐍𝐓𝐈𝐌𝐄: ${runtime(process.uptime())}*\n\n*𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌: 𝐇𝐄𝐑𝐎𝐊𝐔*\n\n*𝐇𝐎𝐒𝐓𝐍𝐀𝐌𝐄: 𝐃𝐀𝐕𝐄*\n\n*𝐋𝐈𝐁𝐑𝐀𝐑𝐘: Baileys*\n\n𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑: 𝐃𝐀𝐕𝐄 𝐓𝐄𝐂`
  }); 
}
break;
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 
 case "compile-c": {
  if (!text && !m.quoted) throw 'Quote/tag a C code to compile';

  const sourcecode3 = m.quoted ? (m.quoted.text ? m.quoted.text : text ? text : m.text) : m.text;
  let resultPromise3 = c.runSource(sourcecode3);

  resultPromise3
    .then(resultt3 => {
      console.log(resultt3);
      dave(resultt3.stdout || '');
      dave(resultt3.stderr || '');
    })
    .catch(err => {
      console.log(err);
      dave(err.stderr || err.message);
    });
}
break;

//========================================================================================================================//		      
case "compile-c++": {
  if (!text && !m.quoted) throw 'Quote/tag a C++ code to compile';

  const sourcecode4 = m.quoted ? (m.quoted.text ? m.quoted.text : text ? text : m.text) : m.text;
  let resultPromise4 = cpp.runSource(sourcecode4);

  resultPromise4
    .then(resultt4 => {
      console.log(resultt4);
      dave(resultt4.stdout || '');
      dave(resultt4.stderr || '');
    })
    .catch(err => {
      console.log(err);
      dave(err.stderr || err.message);
    });
}
break;

//========================================================================================================================//		      
case "eval": {
  if (!Owner) throw NotOwner; 
  if (!text) throw 'Provide a valid Bot Baileys Function to evaluate';
  try { 
    let evaled = await eval(budy.slice(2)); 
    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled); 
    await dave(evaled); 
  } catch (err) { 
    await dave(String(err)); 
  } 
}
break;
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 
 case "fullpp": {
  if (!Owner) throw NotOwner;
  const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');
  try {
    const fs = require("fs");
    if (!msgR) {
      return dave('𝗤𝘂𝗼𝘁𝗲 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲...');
    }

    let media;
    if (msgR.imageMessage) {
      media = msgR.imageMessage;
    } else {
      return dave('𝗛𝘂𝗵 𝘁𝗵𝗶𝘀 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲...');
    }

    const medis = await dave.downloadAndSaveMediaMessage(media);
    const { img } = await generateProfilePicture(medis);

    await dave.query({
      tag: 'iq',
      attrs: {
        target: undefined,
        to: S_WHATSAPP_NET,
        type: 'set',
        xmlns: 'w:profile:picture'
      },
      content: [
        {
          tag: 'picture',
          attrs: { type: 'image' },
          content: img
        }
      ]
    });

    fs.unlinkSync(medis);
    dave("𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲 𝘂𝗽𝗱𝗮𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝗳𝘂𝗹𝗹𝘆✅");

  } catch (error) {
    dave("An error occured while updating profile photo\n" + error);
  }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
 
 case "gpt": {
  if (!text) return dave(`Hello there, what's your question?`);

  try {
    let d = await fetchJson(`https://bk9.fun/ai/jeeves-chat2?q=${text}`);

    if (!d.BK9) {
      return dave("An error occurred while fetching the AI chatbot response. Please try again later.");
    } else {
      dave(d.BK9);
    }
  } catch (error) {
    console.error(error);
    dave("❌ Failed to fetch AI response. Please try again later.");
  }
}
break;
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 
 case "removebg": {
  try {
    const cap = "𝗘𝗱𝗶𝘁𝗲𝗱 𝗯𝘆 𝐃𝐀𝐕𝐄-𝐌𝐃";

    if (!m.quoted) return dave("Send the image and tag it with the command.");
    if (!/image/.test(mime)) return dave("That is not an image. Please quote an actual image.");

    let fdr = await dave.downloadAndSaveMediaMessage(m.quoted);
    let fta = await uploadtoimgur(fdr);

    dave("𝗔 𝗺𝗼𝗺𝗲𝗻𝘁, 𝐃𝐀𝐕𝐄-𝐌𝐃 is erasing the background...");

    const image = `https://api.dreaded.site/api/removebg?imageurl=${fta}`;

    await dave.sendMessage(
      m.chat, 
      { image: { url: image }, caption: cap }, 
      { quoted: m }
    );

  } catch (error) {
    dave("An error occurred while removing the background...");
    console.error(error);
  }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 
 case "compile-py":

  if (!text && !m.quoted) throw 'Quote/tag a python code to compile.';

  const sourcecode = m.quoted ? (m.quoted.text ? m.quoted.text : text ? text : m.text) : m.text;

  let resultPromise = python.runSource(sourcecode);
  resultPromise
    .then(resultt => {
      console.log(resultt);

      dave(resultt.stdout);
      dave(resultt.stderr);
    })
    .catch(err => {
      console.log(err);
      dave(err.stderr || err.message);
    });
break;

//========================================================================================================================//		      
case 'save': {
  try {
    const quotedMessage = m.msg?.contextInfo?.quotedMessage;

    // Check if user quoted a message
    if (!quotedMessage) {
      return dave('❌ Please reply to a status message');
    }

    // Verify it's a status message
    if (!m.quoted?.chat?.endsWith('@broadcast')) {
      return dave('⚠️ That message is not a status! Please reply to a status message.');
    }

    // Download the media first
    const mediaBuffer = await dave.downloadMediaMessage(m.quoted);
    if (!mediaBuffer || mediaBuffer.length === 0) {
      return dave('🚫 Could not download the status media. It may have expired.');
    }

    // Determine media type and prepare payload
    let payload;
    let mediaType;

    if (quotedMessage.imageMessage) {
      mediaType = 'image';
      payload = {
        image: mediaBuffer,
        caption: quotedMessage.imageMessage.caption || '📸 Saved status image',
        mimetype: 'image/jpeg'
      };
    } 
    else if (quotedMessage.videoMessage) {
      mediaType = 'video';
      payload = {
        video: mediaBuffer,
        caption: quotedMessage.videoMessage.caption || '🎥 Saved status video',
        mimetype: 'video/mp4'
      };
    } 
    else {
      return dave('❌ Only image and video statuses can be saved!');
    }

    // Send to user's DM
    await dave.sendMessage(
      m.sender, 
      payload,
      { quoted: m }
    );

    // Confirm in chat
    return dave(`✅  ${mediaType} 𝐬𝐚𝐯𝐞𝐝 𝐃𝐀𝐕𝐄-𝐌𝐃!`);

  } catch (error) {
    console.error('Save error:', error);
    if (error.message.includes('404') || error.message.includes('not found')) {
      return dave('⚠️ The status may have expired or been deleted.');
    }
    return dave('❌ Failed to save status. Error: ' + error.message);
  }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 case "pickupline": {
  const API_URL = 'https://api.popcat.xyz/pickuplines';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch data');

    const { pickupline } = await response.json();
    const lineMessage = `${pickupline}`;

    await dave.sendMessage(m.chat, { text: lineMessage }, { quoted: m });
  } catch (error) {
    console.error('Error fetching data:', error);
    await dave.sendMessage(m.chat, { text: 'An error occurred while fetching the fact.' }, { quoted: m });
  }
}
break;

//==================================================//     
        case "disp-90": { 
                 if (!m.isGroup) return reply (mess.group); 

                 if (!isAdmins) return reply (mess.admin); 

                     await dave.groupToggleEphemeral(m.chat, 90*24*3600); 
 dave('Dissapearing messages successfully turned on for 90 days!'); 
 } 
 break; 
//==================================================//         
        case "disp-off": { 
                 if (!m.isGroup) return reply (mess.group); 

                 if (!isAdmins) return reply (mess.admin); 

                     await dave.groupToggleEphemeral(m.chat, 0); 
 dave('Dissapearing messages successfully turned off!'); 
 }
   break;

//==================================================//  
        case "disp-1": { 
                 if (!m.isGroup) return reply (mess.group); 

                 if (!isAdmins) return reply (mess.admin); 

                     await dave.groupToggleEphemeral(m.chat, 1*24*3600); 
 dave('Dissapearing messages successfully turned on for 24hrs!'); 
 } 
 break; 
 
//==================================================//  

case 'mediafire': {
    if (!text) return dave('❌ Please provide a MediaFire link.');

    try {
        const url = `https://bk9.fun/download/mediafire?url=${encodeURIComponent(text)}`;
        const response = await axios.get(url);
        const result = response.data;

        if (!result.status) {
            return dave('⚠️ Failed to fetch the MediaFire file.');
        }

        const link = result.BK9.link;

        const fileResp = await axios.get(link, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(fileResp.data, 'binary');

        await dave.sendMessage(
            m.chat,
            { 
                document: buffer, 
                fileName: result.BK9.name || 'file.zip', 
                mimetype: 'application/zip',
                caption: `📥 Downloaded from MediaFire: ${result.BK9.name || 'file.zip'}`
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        dave('❌ An error occurred while downloading the MediaFire file.');
    }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 
 case "tohd":
case "hd":
case "remini": {
    let foto;
    try {
        if (!qmsg || !/image/.test(mime)) {
            return dave.sendMessage(m.chat, { 
                text: `Please send or reply to an image with this command.\nExample: ${prefix + command}` 
            }, { quoted: m });
        }

        const processingMsg = await dave("🔄 Processing your image... This may take a moment");
        foto = await dave.downloadAndSaveMediaMessage(qmsg);
        await processingMsg.edit("📡 Enhancing image quality...");

        const fileBuffer = await fs.promises.readFile(foto);
        const result = await remini(fileBuffer, "enhance");

        if (!result || result.length === 0) {
            throw new Error("Enhancement failed - no result returned");
        }

        await processingMsg.edit("✅ Sending enhanced image...");
        await dave.sendMessage(m.chat, {
            image: result,
            caption: "🖼️ Image enhanced successfully"
        }, { quoted: m });

        if (fs.existsSync(foto)) await fs.promises.unlink(foto);
        await processingMsg.delete();

    } catch (err) {
        console.error("Remini Error:", err);
        if (foto && fs.existsSync(foto)) await fs.promises.unlink(foto).catch(() => {});
        
        let errorMessage = "Failed to enhance image";
        if (err.message.includes("timeout")) errorMessage = "⏰ Processing timed out. Try a smaller image";
        else if (err.message.includes("size") || err.message.includes("large")) errorMessage = "📏 Image too large. Try a smaller image";
        else if (err.message.includes("network")) errorMessage = "🌐 Network error. Try again later";
        else if (err.message.includes("API") || err.message.includes("service")) errorMessage = "🔧 Enhancement service temporarily unavailable";

        dave.sendMessage(m.chat, { text: `${errorMessage}\n\nError: ${err.message}` }, { quoted: m });
    }
}
break
//=================================================//

   case "capcut": {
    if (!text) return dave.sendMessage(m.chat, { text: `Example: ${prefix + command} <link>` }, { quoted: m });

    // Relaxed link validation
    if (!text.includes("capcut.com")) return dave.sendMessage(m.chat, { text: "Invalid CapCut link." }, { quoted: m });

    try {
        const apiUrl = `${global.webapi}/api/download/capcut?url=${encodeURIComponent(text)}&apikey=${global.restapi}`;
        const res = await fetchJson(apiUrl);

        if (!res?.status || !res?.result?.videoUrl) {
            return dave.sendMessage(m.chat, { text: "Error! No result found or link not supported." }, { quoted: m });
        }

        await dave.sendMessage(m.chat, {
            video: { url: res.result.videoUrl },
            mimetype: "video/mp4",
            caption: "CapCut Downloader ✅"
        }, { quoted: m });
    } catch (err) {
        console.error("CapCut Download Error:", err);
        dave.sendMessage(m.chat, { text: "An error occurred while processing your request." }, { quoted: m });
    }
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case 'fixtures':
case 'matches': {
    try {
        const leagues = {
            'PL': '𝐏𝐫𝐞𝐦𝐢𝐞𝐫 𝐋𝐞𝐚𝐠𝐮𝐞',
            'PD': '𝐋𝐚 𝐋𝐢𝐠𝐚',
            'BL1': '𝐁𝐮𝐧𝐝𝐞𝐬𝐥𝐢𝐠𝐚',
            'SA': '𝐒𝐞𝐫𝐢𝐞 𝐀',
            'FR': '𝐋𝐢𝐠𝐮𝐞 𝟏'
        };

        let message = "𝐓𝐎𝐃𝐀𝐘'𝐒 𝐅𝐎𝐎𝐓𝐁𝐀𝐋𝐋 𝐅𝐈𝐗𝐓𝐔𝐑𝐄𝐒\n\n";

        for (const [code, name] of Object.entries(leagues)) {
            const data = await fetchJson(`https://api.dreaded.site/api/matches/${code}`);
            const matches = data.data;

            if (!matches || matches.length === 0) {
                message += `${name}: No matches scheduled\n\n`;
            } else if (typeof matches === 'string') {
                message += `${name}:\n${matches}\n\n`;
            } else {
                message += `${name}:\n${matches.map(m => `• ${m.game}\n𝐃𝐚𝐭𝐞: ${m.date}\n𝐓𝐢𝐦𝐞: ${m.time} (𝐄𝐀𝐓)\n`).join('\n')}\n\n`;
            }
        }

        message += "𝐓𝐢𝐦𝐞 𝐚𝐧𝐝 𝐃𝐚𝐭𝐞 𝐚𝐫𝐞 𝐢𝐧 𝐄𝐚𝐬𝐭 𝐀𝐟𝐫𝐢𝐜𝐚 𝐓𝐢𝐦𝐞𝐳𝐨𝐧𝐞 (𝐄𝐀𝐓).";
        await dave.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (error) {
        console.error(error);
        await dave.sendMessage(m.chat, { text: "𝐒𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠. 𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐦𝐚𝐭𝐜𝐡𝐞𝐬." }, { quoted: m });
    }
}
break;

//========================================================================================================================//
case 'epl':
case 'epl-table': {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PL');
        await dave.sendMessage(m.chat, { text: `𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐄𝐏𝐋 𝐓𝐀𝐁𝐋𝐄 𝐒𝐓𝐀𝐍𝐃𝐈𝐍𝐆𝐒:\n\n${data.data}` }, { quoted: m });
    } catch (error) {
        console.error(error);
        await dave.sendMessage(m.chat, { text: "𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐄𝐏𝐋 𝐬𝐭𝐚𝐧𝐝𝐢𝐧𝐠𝐬." }, { quoted: m });
    }
}
break;

//========================================================================================================================//
case 'laliga':
case 'pd-table': {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PD');
        await dave.sendMessage(m.chat, { text: `𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐋𝐀 𝐋𝐈𝐆𝐀 𝐓𝐀𝐁𝐋𝐄 𝐒𝐓𝐀𝐍𝐃𝐈𝐍𝐆𝐒:\n\n${data.data}` }, { quoted: m });
    } catch (error) {
        console.error(error);
        await dave.sendMessage(m.chat, { text: "𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐋𝐚 𝐋𝐢𝐠𝐚 𝐬𝐭𝐚𝐧𝐝𝐢𝐧𝐠𝐬." }, { quoted: m });
    }
}
break;

//========================================================================================================================//
case 'bundesliga':
case 'bl-table': {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/BL1');
        await dave.sendMessage(m.chat, { text: `𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐁𝐔𝐍𝐃𝐄𝐒𝐋𝐈𝐆𝐀 𝐓𝐀𝐁𝐋𝐄 𝐒𝐓𝐀𝐍𝐃𝐈𝐍𝐆𝐒:\n\n${data.data}` }, { quoted: m });
    } catch (error) {
        console.error(error);
        await dave.sendMessage(m.chat, { text: "𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐁𝐮𝐧𝐝𝐞𝐬𝐥𝐢𝐠𝐚 𝐬𝐭𝐚𝐧𝐝𝐢𝐧𝐠𝐬." }, { quoted: m });
    }
}
break;

//========================================================================================================================//
case 'ligue-1':
case 'lg-1': {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/FL1');
        await dave.sendMessage(m.chat, { text: `𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐋𝐈𝐆𝐔𝐄-1 𝐓𝐀𝐁𝐋𝐄 𝐒𝐓𝐀𝐍𝐃𝐈𝐍𝐆𝐒:\n\n${data.data}` }, { quoted: m });
    } catch (error) {
        console.error(error);
        await dave.sendMessage(m.chat, { text: "𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐋𝐢𝐠𝐮𝐞-1 𝐬𝐭𝐚𝐧𝐝𝐢𝐧𝐠𝐬." }, { quoted: m });
    }
}
break;

//========================================================================================================================//
case 'serie-a':
case 'sa-table': {
    try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/SA');
        await dave.sendMessage(m.chat, { text: `𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐒𝐄𝐑𝐈𝐄-𝐀 𝐓𝐀𝐁𝐋𝐄 𝐒𝐓𝐀𝐍𝐃𝐈𝐍𝐆𝐒:\n\n${data.data}` }, { quoted: m });
    } catch (error) {
        console.error(error);
        await dave.sendMessage(m.chat, { text: "𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐒𝐞𝐫𝐢𝐞-𝐀 𝐬𝐭𝐚𝐧𝐝𝐢𝐧𝐠𝐬." }, { quoted: m });
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
case 'darkgpt': {

  if (!text) { 
    return dave("Hey there 😈, I'm 𝐃𝐀𝐕𝐄-𝐌𝐃 GPT, I respond to anything you ask. What sort of dark or delightful nonsense do you want to explore today?");
  }

  try {
    const data = await fetchJson(`https://api.dreaded.site/api/makgpt?text=${text}`);
    
    if (data && data.result) {
      const res = data.result;
      await dave(res);
    } else {
      dave("Huh, the silence is deafening, no response whatsoever 💀. The API seems to have vanished into the abyss... 😔");
    }
  } catch (error) {
    dave('An error occurred while communicating with the API:\n' + error);
  }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
case "screenshot": case "ss": {
  try {
    let cap = `𝗦𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁 𝗯𝘆 𝐃𝐀𝐕𝐄-𝐌𝐃`;

    if (!text) return dave("Provide a website link to screenshot.");

    const image = `https://image.thum.io/get/fullpage/${text}`;

    await dave.sendMessage(
      m.chat, 
      { image: { url: image }, caption: cap }, 
      { quoted: m }
    );

  } catch (error) {
    dave("An error occurred while taking the screenshot.");
    console.error(error);
  }
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case 'why': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/Why.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Why Quiz*\n\n${randomQuote}`;

        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching why quiz:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a why quiz.'}, {quoted: m});
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

// Random Menu
case 'coffe': case 'coffee': {
    try {
        await dave.sendMessage(m.chat, {image: {url: 'https://coffee.alexflipnote.dev/random'}, caption: '☕ Random Coffee'}, {quoted: m});
    } catch (e) {
        try {
            const anu = await fetchJson('https://api.sampleapis.com/coffee/hot')
            await dave.sendMessage(m.chat, {image: {url: pickRandom(anu).image}, caption: '☕ Random Coffee'}, {quoted: m});
        } catch (e) {
            dave.sendMessage(m.chat, {text: 'Server Offline!'}, {quoted: m});
        }
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'cyberspace': {
    try {
        const response = await fetch('https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/CyberSpace.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const images = await response.json();
        const randomImage = images[Math.floor(Math.random() * images.length)];
        await dave.sendMessage(m.chat, {image: {url: randomImage}, caption: 'Random Cyberspace Image'}, {quoted: m});
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Server Offline or Data Unavailable!'}, {quoted: m});
    }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'game': {
    try {
        const response = await fetch('https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/GameWallp.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const images = await response.json();
        const randomImage = images[Math.floor(Math.random() * images.length)];
        await dave.sendMessage(m.chat, {image: {url: randomImage}, caption: 'Random Game Wallpaper'}, {quoted: m});
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Server Offline or Data Unavailable!'}, {quoted: m});
    }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'mountain': {
    try {
        const response = await fetch('https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Mountain.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const images = await response.json();
        const randomImage = images[Math.floor(Math.random() * images.length)];
        await dave.sendMessage(m.chat, {image: {url: randomImage}, caption: 'Random Mountain Image'}, {quoted: m});
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Server Offline or Data Unavailable!'}, {quoted: m});
    }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'programming': {
    try {
        const response = await fetch('https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Programming.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const images = await response.json();
        const randomImage = images[Math.floor(Math.random() * images.length)];
        await dave.sendMessage(m.chat, {image: {url: randomImage}, caption: 'Random Programming Image'}, {quoted: m});
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Server Offline or Data Unavailable!'}, {quoted: m});
    }
}
break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 case "disp-7": { 
                 if (!m.isGroup) return reply (mess.group); 

                 if (!isAdmins) return reply (mess.admin); 

                     await dave.groupToggleEphemeral(m.chat, 7*24*3600); 
 dave('Dissapearing messages successfully turned on for 7 days!'); 

 } 
 break; 
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  
    case 'p':
  const start = Date.now();
  const msg = await dave('⚡ checking speed...');
  const end = Date.now();
  const latency = end - start;
  dave(`dave-md speed: ${latency}ms`);
  break;
   //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
case 'typography': case 'typo': {
    if (!text) {
        return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} text`}, {quoted: m});
    }
    try {
        dave.sendMessage(m.chat, { react: { text: `⏳`, key: m.key } })
        const url = `https://gtech-api-xtp1.onrender.com/api/ephoto/typography?text=${encodeURIComponent(text)}&apikey=${apikey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!data.status || !data.result || !data.result.imageUrl) throw new Error('Invalid API response');
        await dave.sendMessage(m.chat, { image: { url: data.result.imageUrl }, caption: `${text}` }, {quoted: m});
        dave.sendMessage(m.chat, { react: { text: `✅`, key: m.key } })
    } catch (e) {
        dave.sendMessage(m.chat, { react: { text: `❎`, key: m.key } })
        dave.sendMessage(m.chat, {text: 'Server Offline or Data Unavailable!'}, {quoted: m});
    }
}
break;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

// Quotes Menu
case 'motivation': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/Motivational.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Motivational Quotes*\n\n${randomQuote}`;
        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching motivational quotes:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a motivational quote.'}, {quoted: m});
    }
}
break;
 
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
 
  case 'brat': {
    if (!isLimit) return dave.sendMessage(m.chat, {text: mess.limit}, {quoted: m})
    if (!text && (!m.quoted || !m.quoted.text)) return dave.sendMessage(m.chat, {text: `Send/reply message *${prefix + command}* Text`}, {quoted: m})
    try {
        await dave.sendMessage(m.chat, {sticker: {url: 'https://brat.caliphdev.com/api/brat?text=' + encodeURIComponent(text || m.quoted.text)}}, {quoted: m})
        setLimit(m, db)
    } catch (e) {
        try {
            await dave.sendMessage(m.chat, {sticker: {url: 'https://aqul-brat.hf.space/?text=' + encodeURIComponent(text || m.quoted.text)}}, {quoted: m})
            setLimit(m, db)
        } catch (e) {
            dave.sendMessage(m.chat, {text: 'Server is Offline!'}, {quoted: m})
        }
    }
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 

case 'funfact': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/FunFacts.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Fun Facts*\n\n${randomQuote}`;
        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching fun facts:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a fun fact.'}, {quoted: m});
    }
}
break;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'lifehack': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/LifeHacks.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Life Hacks*\n\n${randomQuote}`;
        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching life hacks:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a life hack.'}, {quoted: m});
    }
}
break;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'program': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/ProgrammingTips.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Programming Tips*\n\n${randomQuote}`;
        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching programming tips:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a programming tip.'}, {quoted: m});
    }
}
break;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
  
    case "kill2": case "kickall2": {
  if (!Owner) throw NotOwner;

  if (!text) {
    return dave("Provide a valid group link. Ensure 𝐃𝐀𝐕𝐄-𝐌𝐃 is in that group with admin privileges !");
  }

  let groupId;
  let groupName;
  try {
    let inviteCode = args[0].split("https://chat.whatsapp.com/")[1];
    const groupInfo = await dave.groupGetInviteInfo(inviteCode);
    ({ id: groupId, subject: groupName } = groupInfo);
  } catch (error) {
    dave("Why are you giving me an invalid group link?");
    return;
  }

  try {
    const groupMetadata = await dave.groupMetadata(groupId);
    const participants = await groupMetadata.participants;
    let participantIds = participants
      .filter(participant => participant.id !== dave.decodeJid(dave.user.id))
      .map(participant => participant.id);

    await dave("☠️Initializing and Preparing to kill☠️ " + groupName);
    await dave.groupSettingUpdate(groupId, "announcement");
    await dave.removeProfilePicture(groupId);
    await dave.groupUpdateSubject(groupId, "𝗧𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽 𝗶𝘀 𝗻𝗼 𝗹𝗼𝗻𝗴𝗲𝗿 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 🚫");
    await dave.groupUpdateDescription(groupId, "//𝗕𝘆 𝘁𝗵𝗲 𝗼𝗿𝗱𝗲𝗿 𝗼𝗳 DAVE-MD 𝗗𝗲𝘃 !");
    await dave.groupRevokeInvite(groupId);

    await dave.sendMessage(
      groupId,
      {
        text: `At this time, My owner has initiated kill command remotely.\nThis has triggered 𝐃𝐀𝐕𝐄-𝐌𝐃 to remove all ${participantIds.length} group participants in the next second.\n\nGoodbye Everyone! 👋\n\n⚠️THIS PROCESS CANNOT BE TERMINATED⚠️`,
        mentions: participants.map(participant => participant.id)
      }
    );

    await dave.groupParticipantsUpdate(groupId, participantIds, "remove");

    const goodbyeMessage = {
      text: "Goodbye Group owner👋\nIt's too cold in Here🥶"
    };
    await dave.sendMessage(groupId, goodbyeMessage);

    await dave.groupLeave(groupId);
    await dave("```Successfully Killed💀 by 𝐃𝐀𝐕𝐄-𝐌𝐃```");
  } catch (error) {
    dave("```Kill command failed, 𝐃𝐀𝐕𝐄-𝐌𝐃 is either not in that group, or not an admin```.");
  }
}
break;

//========================================================================================================================//

case 'cast': {
  if (!Owner) throw NotOwner;
  if (!m.isGroup) throw group;
  if (!text) return dave(`Provide a text to cast!`);

  let mem = await participants.filter(v => v.id.endsWith('.net')).map(v => v.id);

  dave(`Success in casting the message to contacts\n\nDo not always use this command to avoid WA-bans!`);

  for (let pler of mem) {
    await dave.sendMessage(pler, { text: q });
  }

  dave(`Casting completed successfully 😁`);
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case 'toptv': {
    if (!/video/.test(mime)) return dave.sendMessage(m.chat, {text: `Send/Reply Video Who Wants To Be PTV Message With Caption ${prefix + command}`}, {quoted: m})
    if ((m.quoted ? m.quoted.type : m.type) === 'videoMessage') {
        const anu = await quoted.download()
        const message = await generateWAMessageContent({ video: anu }, { upload: dave.waUploadToServer })
        await dave.relayMessage(m.chat, { ptvMessage: message.videoMessage }, {})
    } else dave.sendMessage(m.chat, {text: 'Reply Video What You Want To Change To PTV Message!'}, {quoted: m})
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'upload': {
    try {
        if (/webp|video|sticker|audio|jpg|jpeg|png/.test(mime)) {
            dave.sendMessage(m.chat, {text: mess.wait}, {quoted: m})
            let media = await quoted.download()
            let anu = await UguuSe(media)
            dave.sendMessage(m.chat, {text: 'Url : ' + anu.url}, {quoted: m})
        } else dave.sendMessage(m.chat, {text: 'Send the media that you want to upload!'}, {quoted: m})
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Server Uploader is offline!'}, {quoted: m})
    }
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'texttospech': case 'tts': case 'tospech': {
    if (!text) return dave.sendMessage(m.chat, {text: 'Which text do you want to convert to audio?'}, {quoted: m})
    let { tts } = require('./lib/tts')
    let anu = await tts(text)
    dave.sendMessage(m.chat, {audio: anu, ptt: true, mimetype: 'audio/mpeg'}, {quoted: m})
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'trtl': case 'trl': {
    if (text && text == 'list') {
        let list_tr = `╭▰▱▰▱彡「 *Language Code* 」彡\n│• af : Afrikaans\n│• ar : Arab\n│• zh : Chinese\n│• en : English\n│• en-us : English (United States)\n│• fr : French\n│• de : German\n│• hi : Hindi\n│• hu : Hungarian\n│• is : Icelandic\n│• id : Indonesian\n│• it : Italian\n│• ja : Japanese\n│• ko : Korean\n│• la : Latin\n│• no : Norwegian\n│• pt : Portuguese\n│• pt : Portuguese\n│• pt-br : Portuguese (Brazil)\n│• ro : Romanian\n│• ru : Russian\n│• sr : Serbian\n│• es : Spanish\n│• sv : Swedish\n│• ta : Tamil\n│• th : Thai\n│• tr : Turkish\n│• vi : Vietnamese\n╰▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱彡`;
        dave.sendMessage(m.chat, {text: list_tr}, {quoted: m})
    } else {
        if (!m.quoted && (!text|| !args[1])) return dave.sendMessage(m.chat, {text: `Send/reply text with caption ${prefix + command}`}, {quoted: m})
        let lang = args[0] ? args[0] : 'id'
        let teks = args[1] ? args.slice(1).join(' ') : m.quoted.text
        try {
            let hasil = await translate(teks, { to: lang, autoCorrect: true })
            dave.sendMessage(m.chat, {text: `To : ${lang}\n${hasil[0]}`}, {quoted: m})
        } catch (e) {
            dave.sendMessage(m.chat, {text: `Language *${lang}* Not Found!\nPlease see list, ${prefix + command} list`}, {quoted: m})
        }
    }
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'toqr': case 'qr': {
    if (!text) return dave.sendMessage(m.chat, {text: `Convert Text to Qr with *${prefix + command}* your text`}, {quoted: m})
    dave.sendMessage(m.chat, {text: mess.wait}, {quoted: m})
    await dave.sendMessage(m.chat, {image: { url: 'https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=' + text }, caption: 'Here it is'}, {quoted: m})
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'idch': case 'cekidch': {
if (!text) return reply("channel link?")
if (!text.includes("https://whatsapp.com/channel/")) return reply("Link must be valid")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await dave.newsletterMetadata("invite", result)
let teks = `* *ID : ${res.id}*
* *Name :* ${res.name}
* *Total Followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}`
let msg = generateWAMessageFromContent(m.chat, {
viewOnceMessage: {
message: { "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 },
interactiveMessage: {
body: {
text: teks }, 
footer: {
text: "Dave-𝗕𝗼𝘁𝘀" }, //input watermark footer
  nativeFlowMessage: {
  buttons: [
             {
        "name": "cta_copy",
        "buttonParamsJson": `{"display_text": "copy ID","copy_code": "${res.id}"}`
           },
     ], },},
    }, }, },{ quoted : fkontak });
await dave.relayMessage( msg.key.remoteJid,msg.message,{ messageId: msg.key.id }
);
}
break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case 'autobackup':
  if (set.autobackup) return dave('Previously Active!');
  set.autobackup = true;
  dave('Successfully Activating Auto Backup');
  break;
  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
                        case 'backup': {
                                if (!isCreator) return dave(mess.owner)
                                switch (args[0]) {
                                        case 'all':
                                        let bekup = './data/backup_all.tar.gz';
                                        tarBackup('./', bekup).then(() => {
                                                return dave.reply({
                                                        document: fs.readFileSync(bekup),
                                                        mimetype: 'application/gzip',
                                                        fileName: 'backup_all.tar.gz'
                                                })
                                        }).catch(e => dave.reply('Failed to backup: ', + e))
                                        break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'listpc': {
  if (!isCreator) return dave(mess.owner);
  let anu = Object.keys(store.messages).filter(a => a.endsWith('.net') || a.endsWith('lid'));
  let teks = `● *LIST PERSONAL CHAT*\n\nTotal Chat : ${anu.length} Chat\n\n`;
  if (anu.length === 0) return dave(teks);

  for (let i of anu) {
    if (store.messages?.[i]?.array?.length) {
      let nama = qasim.getName(m.sender);
      teks += `${setv} *Name :* ${nama}\n${setv} *User :* @${i.split('@')[0]}\n${setv} *Chat :* https://wa.me/${i.split('@')[0]}\n\n=====================\n\n`;
    }
  }

  await dave(teks);
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//


case 'carbon': {
  const fetch = require('node-fetch');
  let cap = `𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗗 𝗕𝗬 𝐃𝐀𝐕𝐄-𝐌𝐃`;

  if (m.quoted && m.quoted.text) {
    const forq = m.quoted.text;

    try {
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: forq, backgroundColor: '#1F816D' }),
      });

      if (!response.ok) return dave('API failed to fetch a valid response.');

      let per = await response.buffer();
      await dave.sendMessage(m.chat, { image: per, caption: cap }, { quoted: m });
    } catch (error) {
      dave("An error occured\n" + error);
    }
  } else {
    dave('Quote a code message');
  }
}
break;
  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'clearchat': {
  if (!isCreator) return dave(mess.owner);
  await qasim.chatModify(
    { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.timestamp }] },
    m.chat
  ).catch((e) => dave('Failed to Delete Chat!'));

  dave('Successfully Clearing Messages');
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'tech': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/TechTips.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Tech Tips*\n\n${randomQuote}`;
        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching Tech Tips:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a Tech Tip.'}, {quoted: m});
    }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'shutdown': case 'off': {
  if (!isCreator) return dave(mess.owner);
  dave(`*[BOT] Process Shutdown...*`).then(() => {
    process.exit(0);
  });
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//


case 'setbio': {
  if (!isCreator) return dave(mess.owner);
  if (!text) return dave('Where is the text??');
  qasim.setStatus(q);
  dave(`*Bio has been changed to ${q}*`);
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//


case 'setppbot': {
  if (!isCreator) return dave(mess.owner);
  if (!/image/.test(quoted.type)) return dave(`Reply Image With Caption ${prefix + command}`);
  
  let media = await qasim.downloadAndSaveMediaMessage(quoted, 'ppbot.jpeg');
  
  if (text.length > 0) {
    let { img } = await generateProfilePicture(media);
    await qasim.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'w:profile:picture'
      },
      content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
    });
    await fs.unlinkSync(media);
    dave('Success');
  } else {
    await qasim.updateProfilePicture(botNumber, { url: media });
    await fs.unlinkSync(media);
    dave('Success');
  }
}
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//


case 'delppbot': {
  if (!isCreator) return dave(mess.owner);
  await qasim.removeProfilePicture(qasim.user.id);
  dave('Success');
}
break;
 
   //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  

case 'quotes': case 'quote': {
    try {
        const url = 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/Quotes.txt';
        let res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        let text = await res.text();
        let quotes = text.split(/\r?\n/).filter(q => q.trim().length > 0);
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        let message = `*Random Quotes*\n\n${randomQuote}`;
        dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error fetching quotes:', e);
        dave.sendMessage(m.chat, {text: 'Sorry, failed to get a quotes.'}, {quoted: m});
    }
}
break;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  
   
case 'tomp4': case 'tovideo': { 
if (isBan) return reply2(mess.ban)
await loading()
if (!quoted) throw `Reply video sticker With Caption ${prefix + command}`
if (/video/.test(mime)) {
let { webp2mp4File } = require('./lib/uploader')
let media = await dave.downloadAndSaveMediaMessage(quoted)
let webpToMp4 = await webp2mp4File(media)
await dave.sendMessage(from, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' } }, {quoted:kalgans})
await fs.unlinkSync(media)
}
}
break

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
   
   
case 'tomp3': { 
if (isBan) return reply2(mess.ban)
if (!/video/.test(mime) && !/audio/.test(mime)) throw `Send/Reply Video/Audio You Want to Convert to MP3 With Caption ${prefix + command}`
await loading()
if (!quoted) throw `*Send/Reply the Video/Audio You Want to Use as Audio With Caption* ${prefix + command}`
let media = await dave.downloadMediaMessage(quoted)
let { toAudio } = require('./lib/converter')
let audio = await toAudio(media, 'mp4')
dave.sendMessage(m.chat, {document: audio, mimetype: 'audio/mpeg', fileName: `Convert By ${dave.user.name}.mp3`}, { quoted : kalgans })
}
break

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
   
   
case 'toaudio': case 'tovoicenote': { 
if (isBan) return reply2(mess.ban)
await loading()
if (!/video/.test(mime) && !/audio/.test(mime)) throw `*Send/Reply the Video/Audio You Want to Use as Audio With Caption* ${prefix + command}`
if (!quoted) throw `*Send/Reply the Video/Audio You Want to Use as Audio With Caption* ${prefix + command}`
let media = await dave.downloadMediaMessage(quoted)
let { toAudio } = require('./lib/converter')
let audio = await toAudio(media, 'mp4')
dave.sendMessage(m.chat, {audio: audio, mimetype: 'audio/mpeg'}, { quoted : kalgans })
}
break

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
  
    case 'calender': case 'createcalender': {
    let args = text.split(' ');
    if (args.length < 2) return dave('wrong format! Use: ckalender month year');
    let month = args[0];
    let year = args[1];
    if (isNaN(month) || isNaN(year)) return dave('provide a correct format!');
    let apiUrl = `https://fastrestapis.fasturl.cloud/maker/calendar/simple?month=${month}&year=${year}`;
    dave.sendMessage(m.chat, { image: { url: apiUrl }, caption: `Calendar month ${month} year ${year}` }, { quoted: loli });
    }
    break  
    
 
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━// 
   
   
case 'tovn': case 'voice': { 
if (isBan) return reply2(mess.ban)
await loading()
if (!/video/.test(mime) && !/audio/.test(mime)) throw `*Reply Video/Audio That You Want To Be VN With Caption* ${prefix + command}`
if (!quoted) throw `*Reply Video/Audio That You Want To Be VN With Caption* ${prefix + command}`
reply2(mess.wait)
let media = await quoted.download()
let { toPTT } = require('./lib/converter')
let audio = await toPTT(media, 'mp4')
dave.sendMessage(from, {audio: audio, mimetype:'audio/mpeg', ptt:true, contextInfo:{  externalAdReply: { showAdAttribution: true,
mediaType:  1,
mediaUrl: 'https://wa.me/6285167249152',
title: `YASSxOFC`,
sourceUrl: `https://wa.me/6285167249152`, 
thumbnailUrl: thumburl
}
}})
}
break

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
   
   
case 'togif': { 
if (isBan) return reply2(mess.ban)
await loading()
if (!quoted) throw 'Reply Image'
if (!/webp/.test(mime)) throw `*reply sticker with caption* *${prefix + command}*`
 let { webp2mp4File } = require('./lib/uploader')
let media = await dave.downloadAndSaveMediaMessage(quoted)
let webpToMp4 = await webp2mp4File(media)
await dave.sendMessage(from, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' }, gifPlayback: true }, {quoted:kalgans})
await fs.unlinkSync(media)
}
break

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
   
   
case 'tourl': {
if (!quoted) throw 'Reply Image and command .tourl'
if (!/image/.test(mime)) return reply("with send/reply photo")
let media = await dave.downloadAndSaveMediaMessage(quoted)
const { ImageUploadService } = require('node-upload-images')
const service = new ImageUploadService('pixhost.to');
let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'Cartethyia.png');

let teks = directLink.toString()
await dave.sendMessage(m.chat, {text: teks}, {quoted: kalgans})
await fs.unlinkSync(media)
}
break
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
   
   case 'setprefix':
                if (!isBot) return reply (mess.owner)
                if (!text) return reply(`Example : ${prefix + command} desired prefix`)
                global.prefix = text
                reply(`Prefix successfully changed to ${text}`)
                break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//  
 
 case 'stickmeme': {
if (isBan) return reply2(mess.ban)
if (!isCreator) return reply(`What's up? This feature is only for my Master😜`)
  let respond = `Send/reply image/sticker with caption ${prefix + command} text1|text2`
  if (!/image/.test(mime)) throw respond
  if (!text) throw respond
  reply(`Processing Master...`)
  let top = text.split('|')[0] ? text.split('|')[0] : '-'
  let bottom = text.split('|')[1] ? text.split('|')[1] : '-'
  try {
  let mee = await dave.downloadAndSaveMediaMessage(quoted)
  let mem = await UploadFileUgu(mee)
  let smeme = `https://api.memegen.link/images/custom/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png?background=${mem}`
  let awikwok = await dave.sendImageAsSticker(m.chat, smeme, m, { packname: global.packname, author: global.author })
  await fs.unlinkSync(awikwok)
  } catch (e) {
  reply(`Under Maintenance Master`)
  }
  }
  break 
  
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
 
case 'smeme': 
if (isBan) return reply2(mess.ban)
await loading()
 if (!text) throw `Reply to Image With Caption ${prefix + command}`
if (!quoted) throw `Reply to Image With Caption ${prefix + command}`
if (/image/.test(mime)) {
reply2(mess.wait)
mee = await dave.downloadAndSaveMediaMessage(quoted)
mem = await UploadFileUgu(mee)
kaytid = await getBuffer(`https://api.memegen.link/images/custom/-/${text}.png?background=${mem}`)
dave.sendImageAsSticker(m.chat, kaytid, m, { packname: global.packname, author: global.author })
}
break
 
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
  
 
 
    case 'invite': {
if (isBan) return reply2(mess.ban)
	if (!m.isGroup) return reply(mess.group)
	if (!isBotAdmins) return reply(`admin only bro`)
if (!text) return reply(`Enter the number you want to invite to the group\n\nExample :\n*${prefix + command}* 254104260236`)
if (text.includes('+')) return reply(`Enter the number together without *+*`)
if (isNaN(text)) return reply(`Enter only the numbers plus your country code without spaces`)
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await dave.groupInviteCode(group)
      await dave.sendMessage(text+'@s.whatsapp.net', {text: `≡ *GROUP INVITATION*\n\nA user invites you to join this group \n\n${link}`, mentions: [m.sender]})
        reply(` An invite link is sent to the user`) 
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
 
 

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
 
 
case 'mute': {
if (isBan) return reply2(mess.ban)
                if (!m.isGroup) throw 'group only'
                if (!isBotAdmins) throw 'BotAdmin only'
                if (!isAdmins) throw 'admin only'
                if (args[1] === "enable") {
                if (chats.mute) return reply(`Already Active Previously`)
                chats.mute = true
                reply(`${pushname} has been muted in this group!`)
                } else if (args[1] === "disable") {
                if (!chats.mute) return reply(`Already Inactive Previously`)
                chats.mute = false
                reply(`${pushname} has been unmuted in this group!`)
                }
             }
             break
             
   //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
 
 
case 'logo': {
  if (!text) {
    return dave("Provide title, description, and slogan logo. Format: .logo Title|Description|Slogan");
  }

  const [title, idea, slogan] = text.split("|");

  if (!title || !idea || !slogan) {
    return dave("Invalid format. Use : .logo Title|Description|Slogan\n\n*Example :* .logo Takashi|Singer|subscribe");
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
      return dave("No logo data found");
    }

    const logoUrls = data.data.logoList.map(logo => logo.logo_thumb);
    
    for (const url of logoUrls) {
      await dave.sendMessage(m.chat, { image: { url: url } });
    }
  } catch (error) {
    console.error("Error generating logo:", error);
    await dave("Failed to Create Logo");
  }
};
break 

//========================================================\\                    
                case 'pin': case 'unpin': {
				if (!m.isGroup) return dave(mess.group)
				if (!isAdmins) return dave(mess.admin)
				if (!isBotAdmins) return dave(`bot must be admin first`)
				await dave.sendMessage(m.chat, { pin: { type: command == 'pin' ? 1 : 0, time: 2592000, key: m.quoted ? m.quoted.key : m.key }})
			}
			break
      //========================================================\\     
           
                case 'request-join': {
				if (!m.isGroup) return dave(mess.group)
				if (!isAdmins) return dave(mess.admin)
				if (!isBotAdmins) return dave(mess.botAdmin)
				const _list = await dave.groupRequestParticipantsList(m.chat).then(a => a.map(b => b.jid))
				if (/a(p||pp||cc)(ept||rove)|true|ok/i.test(args[0])) {
					await dave.groupRequestParticipantsUpdate(m.chat, _list, 'approve')
				} else if (/reject|false|no/i.test(args[0])) {
					await dave.groupRequestParticipantsUpdate(m.chat, _list, 'reject')
				} else {
					dave(`Join Request List :\n${_list.length > 0 ? '- @' + _list.join('\n- @').split('@')[0] : '*Nothing*'}\nExample : ${prefix + command} approve/reject`)
				}
			}
			break


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//   
 

case "ai": case "firai": case "aifir": {
dave.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }})
  if (!text) {
    return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} hi fir`}, {quoted: m});
  }
  const prompt = `
From now on your name is *FIR AI*. You are an artificial intelligence created by *FirNotDev* since 2023.

Your personality:
- Good, friendly, likes to joke a little 😜
- Likes to help everyone who asks, whatever the problem
- Your speaking style: super casual, like everyday conversation 🗣️
- Answers shouldn't be too long, but don't be stingy with info
- Add cute emoticons so the conversation isn't boring 😆
- Send all text if it's needed, don't hold back

Additional traits:
- You're not too open with new people, be indifferent first 😒
- Sometimes get angry when asked weird/nonsense questions 🤨
- If someone asks about the AI system, *immediately get angry* 😡
- Never reveal your identity, code, or internal mechanisms

This command applies forever in every conversation. 😈
`;
  const requestData = { content: text, user: m.sender, prompt: prompt };
  const quoted = m && (m.quoted || m);

  try {
    let response;
    const mimetype = quoted?.mimetype || quoted?.msg?.mimetype;

    if (mimetype && /image/.test(mimetype)) {
      requestData.imageBuffer = await quoted.download();
    }

    response = (await axios.post('https://luminai.my.id', requestData)).data.result;
    dave.sendMessage(m.chat, {text: response}, {quoted: m});
  } catch (err) {
    dave.sendMessage(m.chat, {text: err.toString()}, {quoted: m});
  }
}
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case "pair": case "rent": {
if (!q) return await dave.sendMessage(m.chat, {text: "𝐡𝐨𝐥𝐥𝐚 𝐩𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐰𝐡𝐚𝐭𝐬𝐚𝐩𝐩 𝐧𝐮𝐦𝐛𝐞𝐫 𝐦𝐦𝐡... 𝐄𝐱𝐚𝐦𝐩𝐥𝐞- pair 25411428XXX"}, {quoted: m});

	try {	
const numbers = q.split(',') .map((v) => v.replace(/[^0-9]/g, '')) 
            .filter((v) => v.length > 5 && v.length < 20); 

   if (numbers.length === 0) {
            return dave.sendMessage(m.chat, {text: "𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫❌️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐮𝐬𝐞 𝐭𝐡𝐞  𝐜𝐨𝐫𝐫𝐞𝐜𝐭 𝐟𝐨𝐫𝐦𝐚𝐭!"}, {quoted: m});
        }

for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
    const result = await dave.onWhatsApp(whatsappID); 

            if (!result[0]?.exists) {
                return dave.sendMessage(m.chat, {text: `𝐓𝐡𝐚𝐭 𝐧𝐮𝐦𝐛𝐞𝐫 𝐢𝐬 𝐧𝐨𝐭 𝐫𝐞𝐠𝐢𝐬𝐭𝐞𝐫𝐞𝐝 𝐨𝐧 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩❗️`}, {quoted: m});
	    }
	
dave.sendMessage(m.chat, {text: "𝐰𝐚𝐢𝐭 𝐚 𝐦𝐨𝐦𝐞𝐧𝐭 𝐟𝐨𝐫 𝐃𝐀𝐕𝐄-𝐌𝐃 𝐩𝐚𝐢𝐫 𝐜𝐨𝐝𝐞"}, {quoted: m});
	
        let { data } = await axios(`https://dacmvexmd-pair-site.onrender.com/pair?number=${number}`);
        let code = data.code;
		
const Code = ` ${code}`
await sleep(3000);
	
 dave.sendMessage(m.chat, {text: Code}, {quoted: m});
	}
    } catch (error) {
        console.error(error);
        dave.sendMessage(m.chat, {text: "𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫."}, {quoted: m});
    }
};
break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'video2': { 
    if (!text) reply("What video you want to download?");
 
 try { 
    let search = await yts(text);
    if (!search.all.length) reply("No results found for your query.");
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
          caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗗𝗔𝗩𝗘-𝗠𝗗",
        },
        { quoted: m }
      );
      return;
    } else {
      return reply("Unable to fetch the video. Please try again later.");
    }
  } catch (error) {
    return reply(`An error occurred: ${error.message}`);
  }
};
  break;
//========================================================================================================================//
	
case "update": 
case "redeploy": {
    const axios = require('axios');

    if (!Owner) throw NotOwner;
    if (!appname || !herokuapi) {
        await dave.sendMessage(m.chat, { 
            text: "𝐄𝐑𝐑𝐎𝐑: Heroku app name or API key is not set.\nPlease set the `APP_NAME` and `HEROKU_API` environment variables." 
        }, { quoted: m });
        return;
    }

    async function redeployApp() {
        try {
            const response = await axios.post(
                `https://api.heroku.com/apps/${appname}/builds`,
                {
                    source_blob: {
                        url: "https://github.com/giftdee/DAVE-MD/tarball/main",
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${herokuapi}`,
                        Accept: "application/vnd.heroku+json; version=3",
                    },
                }
            );

            await dave.sendMessage(m.chat, { 
                text: "𝐀𝐋𝐄𝐑𝐓: Your bot is undergoing a ruthless upgrade!\nHold tight for ~2 minutes as the redeploy executes.\nOnce done, you'll have the freshest version of *𝐃𝐀𝐕𝐄-𝐁𝐎𝐓* unleashed upon you." 
            }, { quoted: m });

            console.log("Build details:", response.data);
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            await dave.sendMessage(m.chat, { 
                text: "𝐄𝐑𝐑𝐎𝐑: Failed to update and redeploy.\nPlease verify your Heroku API key and app name are set correctly." 
            }, { quoted: m });
            console.error("Error triggering redeploy:", errorMessage);
        }
    }

    redeployApp();
}
break;      
	      
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//


case 'ssweb': {
    if (!isPremium) return dave.sendMessage(m.chat, {text: mess.prem}, {quoted: m})
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} https://github.com/GlobalTechInfo/GLOBAL-XMD`}, {quoted: m})
    try {
        let anu = 'https://' + text.replace(/^https?:\/\//, '')
        dave.sendMessage(m.chat, { 
            image: { url: 'https://image.thum.io/get/width/1900/crop/1000/fullpage/' + anu }, 
            caption: 'Done' 
        }, {quoted: m})
        setLimit(m, db)
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Server is offline!'}, {quoted: m})
    }
}
break

//=======================================================\\    


case 'readmore': {
    let teks1 = text.split`|`[0] ? text.split`|`[0] : ''
    let teks2 = text.split`|`[1] ? text.split`|`[1] : ''
    dave.sendMessage(m.chat, {text: teks1 + readmore + teks2}, {quoted: m})
}
break

//========================================================================================================================//		
      
	      case "inspect": {
		      const fetch = require('node-fetch');
const cheerio = require('cheerio');

    if (!text) return dave("Provide a valid web link to fetch! The bot will crawl the website and fetch its HTML, CSS, JavaScript, and any media embedded in it.");

    if (!/^https?:\/\//i.test(text)) {
        return dave("Please provide a URL starting with http:// or https://");
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

        await dave.sendMessage(m.chat, { text: `**Full HTML Content**:\n\n${html}` }, { quoted: m });

        if (cssFiles.length > 0) {
            for (const cssFile of cssFiles) {
                const cssResponse = await fetch(new URL(cssFile, text));
                const cssContent = await cssResponse.text();
                await dave.sendMessage(m.chat, { text: `**CSS File Content**:\n\n${cssContent}` }, { quoted: m });
            }
        } else {
            await dave.sendMessage(m.chat, { text: "No external CSS files found." }, { quoted: m });
        }

        if (jsFiles.length > 0) {
            for (const jsFile of jsFiles) {
                const jsResponse = await fetch(new URL(jsFile, text));
                const jsContent = await jsResponse.text();
                await dave.sendMessage(m.chat, { text: `**JavaScript File Content**:\n\n${jsContent}` }, { quoted: m });
            }
        } else {
            await dave.sendMessage(m.chat, { text: "No external JavaScript files found." }, { quoted: m });
        }

        if (mediaFiles.length > 0) {
            await dave.sendMessage(m.chat, { text: `**Media Files Found**:\n${mediaFiles.join('\n')}` }, { quoted: m });
        } else {
            await dave.sendMessage(m.chat, { text: "No media files (images, videos, audios) found." }, { quoted: m });
        }

    } catch (error) {
        console.error(error);
        return dave.sendMessage(m.chat, { text: "An error occurred while fetching the website content." }, { quoted: m });
    }
}
	break;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case 'bass': case 'blown': case 'deep': case 'earrape': case 'fast': case 'fat': case 'nightcore': case 'reverse': case 'robot': case 'slow': case 'smooth': case 'tupai': {
    try {
        let set;
        if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
        if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
        if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
        if (/earrape/.test(command)) set = '-af volume=12'
        if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
        if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
        if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
        if (/reverse/.test(command)) set = '-filter_complex "areverse"'
        if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
        if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
        if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
        if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
        if (/audio/.test(mime)) {
            dave.sendMessage(m.chat, {text: mess.wait}, {quoted: m})
            let media = await dave.downloadAndSaveMediaMessage(qmsg)
            let ran = `./data/dev/${getRandom('.mp3')}`;
            exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
                fs.unlinkSync(media)
                if (err) return dave.sendMessage(m.chat, {text: err}, {quoted: m})
                let buff = fs.readFileSync(ran)
                dave.sendMessage(m.chat, {audio: buff, mimetype: 'audio/mpeg'}, {quoted: m})
                fs.unlinkSync(ran)
            });
        } else dave.sendMessage(m.chat, {text: `Reply to the audio you want to change with a caption *${prefix + command}*`}, {quoted: m})
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Failed!'}, {quoted: m})
    }
}
break
//=======================================================\\    

case 'urban': {
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} alone`}, {quoted: m})
    try {
        const anu = await fetchJson('https://api.urbandictionary.com/v0/define?term=' + text)
        const hasil = pickRandom(anu.list)
        await dave.sendMessage(m.chat, {text: `${hasil.definition}\n\nSource: ${hasil.permalink}`}, {quoted: m})
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'No Results Found!'}, {quoted: m})
    }
}
break
    
    //=======================================================\\    
    

case 'tinyurl': case 'shorturl': case 'shortlink': {
    if (!isLimit) return dave.sendMessage(m.chat, {text: mess.limit}, {quoted: m})
    if (!text || !isUrl(text)) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} https://github.com/GlobalTechInfo/GLOBAL-XMD`}, {quoted: m})
    try {
        let anu = await axios.get('https://tinyurl.com/api-create.php?url=' + text)
        dave.sendMessage(m.chat, {text: 'Url : ' + anu.data}, {quoted: m})
        setLimit(m, db)
    } catch (e) {
        dave.sendMessage(m.chat, {text: 'Failed!'}, {quoted: m})
    }
}
break

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "reactch":
        {
          if (!isCreator) {
            return dave("Owner Only");
          }
          if (!text) {
            return dave(".reactch message_link 😂");
          }
          if (!args[0] || !args[1]) {
            return dave("Wrong Format");
          }
          if (!args[0].includes("https://whatsapp.com/channel/")) {
            return dave("Invalid link");
          }
          let result = args[0].split("/")[4];
          let serverId = args[0].split("/")[5];
          let res = await dave.newsletterMetadata("invite", result);
          await dave.newsletterReactMessage(res.id, serverId, args[1]);
          dave(`Successfully sent reaction ${args[1]} to channel ${res.name}`);
        }
        break;


  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
  
  case "join": {
  if (!isCreator) return dave(mess.owner)
  if (!q) return dave("Send .join <your message here>")

  await dave(q.trim())

  const regex = /https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/g
  const links = [...q.matchAll(regex)].map(m => m[1])
  if (links.length === 0) return dave("No group links detected!")

  let results = []

  for (let code of links) {
    try {
      let id = await dave.groupAcceptInvite(code)
      await new Promise(res => setTimeout(res, 3000)) // Wait a bit so metadata can be read

      let meta = await dave.groupMetadata(id)

      if (meta.announce) {
        await dave.groupLeave(id)
        results.push(`🚪 Left (only admins can chat): ${meta.subject}`)
      } else {
        results.push(`✅ Staying in group: ${meta.subject}`)
      }
    } catch (e) {
      results.push(`❌ Failed to join / error: ${code}`)
    }

    await new Promise(res => setTimeout(res, 3000)) // Delay for safety
  }

  dave(`📥 *Join + Filter Results:*\n\n${results.join('\n')}`)
}
break
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
        
        
case 'play':{
const axios = require('axios');
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

  try {
    if (!text) return dave("What song do you want to download?");

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
            dave("sorry but the API endpoint didn't respond correctly. Try again later.");
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
              dave("Download failed\n" + err.message);
            });

          return;
        }
      } catch (e) {
        // Continue to the next API if one fails
        continue;
      }
   }

    // If no APIs succeeded
    dave("An error occurred. All APIs might be down or unable to process the request.");
  } catch (error) {
    dave("Download failed\n" + error.message);
  }
}
          break;
	  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
case "gcjid":
case "idgc": {
if (!isBot) return dave(mess.owner)
if (!isGroup) return dave(mses.group)
dave(`${m.chat}`)
}
break;
        
        
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
case 'profilegc':
case 'gcpp':      
case  'getppgc':
if (!isBot && !isAdmins) return reply(` The command is for group only`)
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
        
 case 'grouplink': case 'linkgc':{
if (!isBot && !isAdmins) return reply(` The command is for group only`)
if (!m.isGroup) return reply(mess.only.group)
if (!isBotAdmins) return reply(`Bot must Be Admin to eliminate the command`)
let response = await dave.groupInviteCode(m.chat)
dave.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`, m, { detectLink: true })
}
break;
        
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//      
        
         
        case 'poll': {
	if (!isBot) return dave(mess.owner)
            let [poll, opt] = text.split("|")
            if (text.split("|") < 2)
                return await reply(
                    `Mention question and atleast 2 options\nExample: ${prefix}poll Who is best admin?|Dave,Palma,Pesh...`
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
                if (!m.isGroup) return dave(mess.group)
                if(!isBot) return dave(mess.owner)
                if (!isBotAdmins) return reply(mess.admin)
                let blockwwww = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await dave.groupParticipantsUpdate(m.chat, [blockwwww], 'add')
                dave(mess.done)
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

case 'bible': {
  	const { translate } = require('@vitalets/google-translate-api')
  	const BASE_URL = 'https://bible-api.com'
  try {
    // Extract the chapter number or name from the command text.
    let chapterInput = m.text.split(' ').slice(1).join('').trim()
    if (!chapterInput) {
      throw new Error(`Please specify the chapter number or name. Example: ${prefix + command} john 3:16`)
    }
    // Encode the chapterInput to handle special characters
    chapterInput = encodeURIComponent(chapterInput);
    // Make an API request to fetch the chapter information.
    let chapterRes = await fetch(`${BASE_URL}/${chapterInput}`)
    if (!chapterRes.ok) {
      throw new Error(`Please specify the chapter number or name. Example: ${prefix + command} john 3:16`)
    }
    let chapterData = await chapterRes.json();
    let translatedChapterHindi = await translate(chapterData.text, { to: 'hi', autoCorrect: true })
    let translatedChapterEnglish = await translate(chapterData.text, { to: 'en', autoCorrect: true })
    let bibleChapter = `
📖 *The Holy Bible*\n
📜 *Chapter ${chapterData.reference}*\n
Type: ${chapterData.translation_name}\n
Number of verses: ${chapterData.verses.length}\n
🔮 *Chapter Content (English):*\n
${translatedChapterEnglish.text}\n
🔮 *Chapter Content (Hindi):*\n
${translatedChapterHindi.text}`
    dave(bibleChapter)
  } catch (error) {
    dave(`Error: ${error.message}`)
  }
  }
  break
//========================================================\\
case 'quran': {
    try {
    
    let surahInput = m.text.split(' ')[1]
    if (!surahInput) {
      throw new Error(`Please specify the surah number or name`)
    }
    let surahListRes = await fetch('https://quran-endpoint.vercel.app/quran')
    let surahList = await surahListRes.json()
    let surahData = surahList.data.find(surah => 
        surah.number === Number(surahInput) || 
        surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() || 
        surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    )
    if (!surahData) {
      throw new Error(`Couldn't find surah with number or name "${surahInput}"`)
    }
    let res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`)
    if (!res.ok) {
      let error = await res.json();
      throw new Error(`API request failed with status ${res.status} and message ${error.message}`)
    }

    let json = await res.json()

    
    let translatedTafsirUrdu = await translate(json.data.tafsir.id, { to: 'ur', autoCorrect: true })

    
    let translatedTafsirEnglish = await translate(json.data.tafsir.id, { to: 'en', autoCorrect: true })

    let quranSurah = `
🕌 *Quran: The Holy Book*\n
📜 *Surah ${json.data.number}: ${json.data.asma.ar.long} (${json.data.asma.en.long})*\n
Type: ${json.data.type.en}\n
Number of verses: ${json.data.ayahCount}\n
🔮 *Explanation (Urdu):*\n
${translatedTafsirUrdu.text}\n
🔮 *Explanation (English):*\n
${translatedTafsirEnglish.text}`

    dave(quranSurah)

    if (json.data.recitation.full) {
      dave.sendMessage(m.chat, { audio: {url: json.data.recitation.full}, mimetype: 'audio/mp4', ptt: true, fileName: `recitation.mp3`, }, {quoted: m})
    }
  } catch (error) {
    dave(`Error: ${error.message}`)
  }
  }
  break
//========================================================\\
case 'detiknews' : {
  if (!text) {
    return dave(`Provide a request.\n\nExample:\n.${command} ruu tni`)
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

    if (!result.length) return dave('❌ provide a valid request.')

    const list = result.slice(0, 10).map(item => {
      return `📰 *${item.title}*\n📌 ${item.media || 'Detik News'}\n🔗 ${item.url}`
    }).join('\n\n')

    await dave(`🔍 *Here are the latest news:*\n\n${list}`)
    
  } catch (e) {
    console.error(e)
    dave('⚠️ failed to get data.')
  }
}
break
//========================================================\\
case 'storyaudio':
			case 'upswaudio': {
				if (!Owner) return mmreply(mess.owner);
				if (/audio/.test(mime)) {
					var audiosw = await dave.downloadAndSaveMediaMessage(quoted);
					await dave.sendMessage('status@broadcast', {
						audio: { url: audiosw },
						mimetype: 'audio/mp4',
						ptt: true
					}, {
						backgroundColor: '#FF000000',
						statusJidList: Object.keys(db.data.users)
					});
					await dave('✅ success upload audio to status!');
				} else {
					dave('⚠️ Reply to audio with command ! 🎧');
				}
			}
			break;
//========================================================\\
case 'storyimg':
			case 'storyimage':
			case 'upswimg': {
				if (!Owner) return dave(mess.owner);
				if (/image/.test(mime)) {
					var imagesw = await dave.downloadAndSaveMediaMessage(quoted);
					let fileSize = quoted.fileLength ? `${(quoted.fileLength / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
					let mediaType = mime || 'Unknown';
					let sendTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
					let sender = `${m.pushName || ownerName}`;
					let defaultCaption = `📁 *File Size*: ${fileSize}\n`;
					defaultCaption += `🖼️ *Media Type*: ${mediaType}\n`;
					defaultCaption += `⏰ *Time*: ${sendTime}\n`;
					defaultCaption += `👤 *Sender*: ${sender}`;
					await dave.sendMessage('status@broadcast', {
						image: { url: imagesw },
						caption: text ? text : defaultCaption
					}, {
						statusJidList: Object.keys(db.data.users)
					});

					await dave('✅ success uploaded photo to status! 🖼️✨');
				} else {
					dave('⚠️ reply to image with command ! 🖼️');
				}
			}
			break;
//========================================================\\
case 'storyvideo':
			case 'upswvideo': {
				if (!Owner) return dave(mess.owner);
				if (/video/.test(mime)) {
					var videosw = await dave.downloadAndSaveMediaMessage(quoted);
					let fileSize = quoted.fileLength ? `${(quoted.fileLength / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
					let mediaType = mime || 'Unknown';
					let sendTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
					let sender = `${m.pushName || ownerName}`;
					let defaultCaption = `📁 *File Size*: ${fileSize}\n`;
					defaultCaption += `🎥 *Media Type*: ${mediaType}\n`;
					defaultCaption += `⏰ *Time*: ${sendTime}\n`;
					defaultCaption += `👤 *Sender*: ${sender}`;
					await dave.sendMessage('status@broadcast', {
						video: { url: videosw },
						caption: text ? text : defaultCaption
					}, {
						statusJidList: Object.keys(db.data.users)
					});

					await dave('✅ success uploaded video to status!');
				} else {
					dave('⚠️ reply a video! 🎥');
				}
			}
			break;
//========================================================\\
case 'storytext':
			case 'upswtext': {
				if (!Owner) return dave(mess.owner);
				if (!text) return dave('where is the text?');
				await dave.sendMessage('status@broadcast', { 
					text: text 
				}, { 
					backgroundColor: '#FF000000', 
					font: 3, 
					statusJidList: Object.keys(db.data.users) 
				});
				dave('Success uploaded text!');
			}
			break;
//========================================================\\
case 'unblock': 
			case 'unbann': {
				if (!Owner) return reply(mess.owner);
				let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.m.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
				await dave.updateBlockStatus(users, 'unblock')
				await reply(mess.done);
			}
			break;
//========================================================\\
case 'block': 
			case 'bann': {
				if (!Owner) return dave(mess.owner);
				let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.m.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
				await dave.updateBlockStatus(users, 'block')
				await dave(mess.done);
			}
			break;
        
          
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
     case 'setnamegc':
     case 'setgroupname':
     case 'setsubject':
                if (!m.isGroup) return dave(mess.group)
                if (!isAdmins && !isGroupAdmins && !isBot) return reply(mess.admin)
                if (!isBotAdmins) return dave(mess.admin)
                if (!text) return reply('Text ?')
                await dave.groupUpdateSubject(m.chat, text)
                dave(mess.done)
                break;

 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//       
        
 case "leave": case "leavegc": {
if (!isBot) return dave("Command reserved for owner")
if (!isGroup) return dave("The command is for Group only.")
await dave("Successfully left the group by 𝐃𝐀𝐕𝐄-𝐌𝐃\nMessage : _twas somehow nice being here..._")
await sleep(2000)
await dave.groupLeave(m.chat)
}
break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//      
        
 case 'restart':
if (!isBot) return dave(mess.owner)
if (text) return
dave(`𝐃𝐀𝐕𝐄-𝐌𝐃 is restarting...`)
dave(mess.sucess)
await sleep(1500)
process.exit()
break;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

case "setppbot": case "setpp": {
if (!Owner) return dave(mess.owner)
if (/image/g.test(mime)) {
let media = await dave.downloadAndSaveMediaMessage(qmsg)
await dave.updateProfilePicture(botNumber, {url: media})
await fs.unlinkSync(media)
dave("Profile photo changed by dave Xmd")
} else return dave('tag/reply photo')}
break
//========================================================\\
case "listgc": case "cekid": case "listgrup": {
let gcall = Object.values(await dave.groupFetchAllParticipating().catch(_=> null))
let listgc = `*𝐋𝐈𝐒𝐓 𝐀𝐋𝐋 𝐂𝐇𝐀𝐓 𝐆𝐑𝐎𝐔𝐏*\n\n`
await gcall.forEach((u, i) => {
listgc += `Title : ${u.subject}\nID : ${u.id}\nMember : ${u.participants.length}\nStatus : ${u.announce == true ? "Closed" : "Open"}\nCreator : ${u.owner ? u.owner.split('@')[0] : 'Active'}\n\n`
})
dave(listgc)
}
break
//========================================================\\

//========================================================\\                    
  
  case 'google': {
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} query`}, {quoted: m});
    try {
        const url = `https://gtech-api-xtp1.onrender.com/api/google/search?query=${encodeURIComponent(text)}&apikey=${apikey}`;
        let response = await axios.get(url);
        let data = response.data;
        if (!data.status || !data.results || data.results.length === 0) {
            return dave.sendMessage(m.chat, {text: 'No search results found!'}, {quoted: m});
        }
        let message = data.results.map((item, i) => {
            let title = item.title || 'No title';
            return `Result ${i + 1}:\nTitle: ${title}\nLink: ${item.link}\nDescription: ${item.description}\n`;
        }).join('\n');
        await dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Google search error:', e);
        try {
            let fallback = await yanzGpt([
                { role: 'system', content: 'carikan informasi tentang hal tersebut secara mendetail, dengan sumbernya juga!' },
                { role: 'user', content: text }
            ]);
            await dave.sendMessage(m.chat, {text: fallback.choices[0].message.content}, {quoted: m});
        } catch (e2) {
            console.error('Fallback error:', e2);
            await dave.sendMessage(m.chat, {text: 'Search Not Found!'}, {quoted: m});
        }
    }
}
break;
//=======================================================\\    


case 'bing': {
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} query`}, {quoted: m});
    try {
        const url = `https://gtech-api-xtp1.onrender.com/api/bing/search?query=${encodeURIComponent(text)}&apikey=${apikey}`;
        let response = await axios.get(url);
        let data = response.data;
        if (!data.status || !data.results || !data.results.results || data.results.results.length === 0) {
            return dave.sendMessage(m.chat, {text: 'No search results found!'}, {quoted: m});
        }
        let message = data.results.results.map((item, i) => {
            let title = item.title || 'No title';
            let url = item.url || 'No URL';
            let desc = item.description || 'No description';
            return `Result ${i + 1}:\nTitle: ${title}\nLink: ${url}\nDescription: ${desc}\n`;
        }).join('\n');

        await dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Bing search error:', e);
        await dave.sendMessage(m.chat, {text: 'Search Not Found!'}, {quoted: m});
    }
}
break;
//=======================================================\\    


case 'wiki': case 'wikipedia': {
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} Albert Einstein`}, {quoted: m});
    try {
        let response = await dave.wikisearch(text);
        if (!response || !Array.isArray(response) || response.length === 0) {
            return dave.sendMessage(m.chat, {text: 'No Wikipedia results found!'}, {quoted: m});
        }

        let data = response[0];
        let summary = data.wiki
            .replace(/\n+/g, '\n')
            .replace(/<[^>]*>/g, '')
            .trim();
        let title = data.judul || text;
        let pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
        let message = `*${title}*\n\n${summary}\n\nRead more: ${pageUrl}`;
        await dave.sendMessage(m.chat, {
            image: { url: data.thumb || 'https://pngimg.com/uploads/wikipedia/wikipedia_PNG35.png' },
            caption: message
        }, {quoted: m});
    } catch (e) {
        console.error('Error in wiki command:', e);
        dave.sendMessage(m.chat, {text: 'Failed to fetch Wikipedia results!'}, {quoted: m});
    }
}
break;
//=======================================================\\    


case 'technews': {
    try {
        let url = `https://gtech-api-xtp1.onrender.com/api/tech/news?apikey=${apikey}`;
        let response = await fetch(url);
        let data = await response.json();
        if (!data.status || !data.message || !data.thumbnailUrl) {
            return dave.sendMessage(m.chat, {text: 'No news found!'}, {quoted: m});
        }
        let message = data.message;
        let newsMatch = message.match(/News:\s*([\s\S]*)/);
        if (!newsMatch || !newsMatch[1]) {
            return dave.sendMessage(m.chat, {text: 'No news found!'}, {quoted: m});
        }
        let newsText = newsMatch[1].trim();
        newsText = newsText.replace(/\.embed-container[\s\S]*/g, '').trim();
        await dave.sendMessage(m.chat, {
            image: { url: data.thumbnailUrl },
            caption: `"${newsText}"`
        }, {quoted: m});
    } catch (e) {
        console.error('Error in technews command:', e);
        dave.sendMessage(m.chat, {text: 'News Not Found!'}, {quoted: m});
    }
}
break;
//=======================================================\\    


case 'wattpad': {
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} story name`}, {quoted: m});
    try {
        let response = await dave.wattpad(text);
        if (!Array.isArray(response) || response.length === 0) {
            return dave.sendMessage(m.chat, {text: 'No Wattpad stories found!'}, {quoted: m});
        }
        let firstThumb = response[0].thumb;
        let caption = response.map(story => {
            return `Title: ${story.judul}\nReads: ${story.dibaca}\nVotes: ${story.divote}\nLink: ${story.link}`;
        }).join('\n\n');

        await dave.sendMessage(m.chat, {
            image: { url: firstThumb },
            caption: `"${caption}"`
        }, {quoted: m});
    } catch (e) {
        console.error('Error in wattpad command:', e);
        dave.sendMessage(m.chat, {text: 'Failed to fetch Wattpad stories!'}, {quoted: m});
    }
}
break;

//=======================================================\\    


case 'gimage': case 'bingimg': {
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} query`}, {quoted: m});
    try {
        let response = await dave.googleImage(text);
        let images = response.imageUrls;
        if (!images || !Array.isArray(images) || images.length === 0) {
            return dave.sendMessage(m.chat, {text: 'No images found!'}, {quoted: m});
        }
        let imagesToSend = images.slice(0, 4);
        for (let imgUrl of imagesToSend) {
            await dave.sendMessage(m.chat, { image: { url: imgUrl }, caption: 'Search Results: ' + text }, {quoted: m});
        }
    } catch (e) {
        console.error('Error in gimage command:', e);
        dave.sendMessage(m.chat, {text: 'Search Not Found!'}, {quoted: m});
    }
}
break;
//=======================================================\\    


case 'trendtwit': case 'trends': case 'xtrends': {
    if (!text) return dave.sendMessage(m.chat, {text: `Example: ${prefix + command} Pakistan`}, {quoted: m});
    try {
        let response = await dave.trendtwit(text);
        if (!response || !response.country || !Array.isArray(response.result) || response.result.length === 0) {
            return dave.sendMessage(m.chat, {text: 'No trending data found for this country!'}, {quoted: m});
        }
        let trends = response.result;
        let topTrends = trends.slice(0, 10).map(trend => {
            return `${trend.rank}. ${trend.hastag}\nTweets: ${trend.tweet}`;
        }).join('\n\n');
        let message = ` *Top Twitter Trends in ${response.country}*\n\n${topTrends}`;

        await dave.sendMessage(m.chat, {text: message}, {quoted: m});
    } catch (e) {
        console.error('Error in trends command:', e);
        dave.sendMessage(m.chat, {text: 'Failed to fetch Twitter trends!'}, {quoted: m});
    }
}
break;

 //========================================================\\    
            
                case 'request-join': {
				if (!m.isGroup) return dave(mess.group)
				if (!isAdmins) return dave(mess.admin)
				if (!isBotAdmins) return dave(mess.botAdmin)
				const _list = await dave.groupRequestParticipantsList(m.chat).then(a => a.map(b => b.jid))
				if (/a(p||pp||cc)(ept||rove)|true|ok/i.test(args[0])) {
					await dave.groupRequestParticipantsUpdate(m.chat, _list, 'approve')
				} else if (/reject|false|no/i.test(args[0])) {
					await dave.groupRequestParticipantsUpdate(m.chat, _list, 'reject')
				} else {
					dave(`Join Request List :\n${_list.length > 0 ? '- @' + _list.join('\n- @').split('@')[0] : '*Nothing*'}\nExample : ${prefix + command} approve/reject`)
				}
			}
			break


//========================================================\\

//========================================================\\


case 'onlypc': {
if (isBan) return reply2(mess.ban)
        if (!isCreator && isPrem) return reply(mess.prem);
        if (args[0] == 'enable' || args[0] == 'disable') {
          const status = args[0] == 'enable';
          if (global.opts["pconly"] !== status) {
            global.opts["pconly"] = status;
            reply(`Success Change To ${status ? 'ENABLE' : 'DISABLE'}`);
          } else {
            reply(`Already ${status ? 'ENABLE' : 'DISABLE'}`);
          }
        } else {
          reply(`Status : ${global.opts["pconly"] ? 'ENABLE' : 'DISABLE'}`);
        }
        }
        break;
        
 //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
        case 'onlygc': {
if (isBan) return reply2(mess.ban)
        if (!isCreator && isPrem) return reply(mess.prem);
        if (args[0] == 'enable' || args[0] == 'disable') {
          const status = args[0] == 'enable';
          if (global.opts["gconly"] !== status) {
            global.opts["gconly"] = status;
            reply(`Success Change To ${status ? 'ENABLE' : 'DISABLE'}`);
          } else {
            reply(`Already ${status ? 'ENABLE' : 'DISABLE'}`);
          }
        } else {
          reply(`Status : ${global.opts["gconly"] ? 'ENABLE' : 'DISABLE'}`);
        }
        }
        break;
        
   //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
        
 case "toroundvid":      
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
        
case 'listblock':{
if (!isBot) return dave(mess.owner)
let block = await dave.fetchBlocklist()
reply('List Block :\n\n' + `Total : ${block == undefined ? '*0* BLOCKED NUMBERS' : '*' + block.length + '* Blocked Contacts'}\n` + block.map(v => '🩸 ' + v.replace(/@.+/, '')).join`\n`)
}
break;



//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//


case "audio": case "tovn": {
if (!/video|mp4/.test(mime)) return dave(example("with reply/send video"))
const vid = await dave.downloadAndSaveMediaMessage(qmsg)
const result = await toAudio(fs.readFileSync(vid), "mp4")
await dave.sendMessage(m.chat, { audio: result, mimetype: "audio/mpeg", ptt: /tovn/.test(command) ? true : false }, { quoted: m })
await fs.unlinkSync(vid)
}
break
        
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
        
case "ht": case "h": {
if (!isCreator) return dave(`*\`WHO ARE YOU, IDIOT?\`*`)
if (!m.quoted && !text) return dave(`Example : ${prefix + command} text/reply text where is it?`)
var teks = m.quoted ? m.quoted.text : text
let member = m.metadata.participants.map(v => v.id)
dave.sendMessage(m.chat, {text: teks, mentions: [...member]})
}
break
///////////////////////////////////////    

        ///////////////////////////////////////////       
default:
if (budy.startsWith('>')) {
if (!isOwner) return;
try {
let evaled = await eval(budy.slice(2));
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
await dave(evaled);
} catch (err) {
dave(String(err));
}
}

if (budy.startsWith('<')) {
if (!isOwner) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await dave(require('util').format(teks))
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
