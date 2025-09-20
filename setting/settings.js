const fs = require('fs')
const chalk = require('chalk')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname + '/.env' })

global.SESSION_ID = process.env.SESSION_ID || '' 

//~~~~~~~~~~~ Owner / Developer Settings ~~~~~~~~~~~//
global.owner = process.env.OWNER_NUMBER || '254104260236'
global.developer = process.env.DEV_NUMBER || '254104260236'
global.ownername = process.env.OWNER_NAME ||'dave'
global.ownername = process.env.OWNER_NAME || 'GIFTED DAVE'
global.devname = process.env.DEV_NAME || 'GIFTED DAVE'
global.ownername    = 'GIFTED DAVE'
global.botname = process.env.BOT_NAME || '𝐃𝐀𝐕𝐄-𝐌𝐃'
global.versisc = process.env.BOT_VERSION || '1.2.4'
global.packname = process.env.BOT_PACKNAME || 'dave-md'

//~~~~~~~~~~~ Social Links ~~~~~~~~~~~//
global.linkwa = process.env.LINK_WA || "https://wa.me/254104260236"
global.linkyt = process.env.LINK_YT || "https://www.youtube.com/Davke"
global.linktt = process.env.LINK_TT || "https://tiktok.com"
global.linktele = process.env.LINK_TELE || "https://t.me/Digladoo"

//~~~~~~~~~~~ Bot Settings ~~~~~~~~~~~//
global.prefix = process.env.BOT_PREFIX || '.'
global.autoRecording = false
global.autoTyping = false
global.autorecordtype = false
global.autoread = process.env.AUTO_READ || false
global.autobio = false
global.anti92 = false
global.antidelete = process.env.ANTI_DELETE || true
global.owneroff = false
global.statusview = process.env.AUTO_STATUS || true
global.autoreact = process.env.AUTO_REACT || false

//~~~~~~~~~~~ Thumbnails ~~~~~~~~~~~//
global.thumbbot = "https://files.catbox.moe/u1hquf.jpg"
global.thumbown = "https://files.catbox.moe/u1hquf.jpg"

//~~~~~~~~~~~ Channel / Newsletter ~~~~~~~~~~~//
global.idchannel = "120363400480173280@newsletter"
global.channelname = "ー𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 UPDATES"
global.channel = "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k"

//~~~~~~~~~~~ Default Messages ~~~~~~~~~~~//
global.mess = {
  developer: "This feature is for developers only!",
  owner: "This feature is for owners only!",
  group: "This feature is for group chats only!",
  private: "This feature is for private chats only!",
  admin: "This feature is for admins only!",
  botadmin: "This feature is for bot admins only!",
  wait: "Please wait, loading...",
  error: "An error occurred!",
  done: "Process completed!"
}

// Auto reload this file on changes
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log('\x1b[0;32m' + __filename + ' updated!\x1b[0m')
  delete require.cache[file]
  require(file)
})