const fs = require('fs')
const chalk = require('chalk')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })


global.SESSION_ID = process.env.SESSION_ID || '' 
//~~~~~~~~~~~ Settings Owner ~~~~~~~~~~~//
global.owner = "254104260236"
global.developer = "254104260236"
global.bot = ""
global.ownername    = 'GIFTED DAVE'
global.devname = "Dave"
global.ownername = process.env.OWNER_NAME ||'Dave'
global.botname = "𝐃𝐀𝐕𝐄-𝐌𝐃"
global.versisc = "2"
global.packname = "reply-md"
//~~~~~~~~~~~ Settings Sosmed ~~~~~~~~~~~//
global.linkwa = "https://wa.me/254104260236"
global.linkyt = "https://www.youtube.com/Davke"
global.linktt = "https://tiktok.com"
global.linktele = "https://t.me Digladoo"

//~~~~~~~~~~~ Settings Bot ~~~~~~~~~~~//
global.prefix = process.env.BOT_PREFIX ||'.'
global.autoRecording = false
global.autoTyping = false
global.autorecordtype = false
global.autoread = process.env.AUTO_READ || false
global.autobio = false
global.anti92 = false
global.antidelete = process.env.ANTI_DELETE || true
global.owneroff = false
global.statusview = process.env.AUTO_STATUS || true
global.autoreact = process.env.AUTO_REACT || 'false'
//~~~~~~~~~~~ Settings Thumbnail ~~~~~~~~~~~//
global.thumbbot = "https://files.catbox.moe/u1hquf.jpg"
global.thumbown = "https://files.catbox.moe/u1hquf.jpg"

//~~~~~~~~~~~ Settings Channel ~~~~~~~~~~~//
global.idchannel = "120363400480173280@newsletter*"
global.channelname = "ー𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 UPDATES"
global.channel = "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k"

//~~~~~~~~~~~ Settings Message ~~~~~~~~~~~//
global.mess = {
  developer: "This feature is for developers only!!",
  owner: " feature is for owners only!",
  group: "This feature is for group chats only!!",
  private: "This feature is for private chats only!",
  admin: "This feature is for admins only!!",
  botadmin: "This feature is for bot admins only!!",
  wait: "Please wait, loading...",
  error: "An error occurred!",
  done: "Process completed!"
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
