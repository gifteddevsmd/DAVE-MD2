const fs = require('fs');
const path = require('path');

// === Load environment variables ===
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

// === Global APIs ===
global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
};

// === API Keys ===
global.APIKeys = {
    'https://api.xteam.xyz': 'd90a9e986e18778b',
    'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
    'https://api.neoxr.my.id': 'yourkey',
    'https://violetics.pw': 'beta',
    'https://zenzapis.xyz': 'yourkey',
    'https://api-fgmods.ddns.net': 'fg-dylux'
};

// === Export Config ===
module.exports = {
  BOT_NAME: process.env.BOT_NAME || '𝘿𝙖𝙫𝙚𝘼𝙄',
  OWNER_NAME: process.env.OWNER_NAME || 'Gifted-Dave',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '254104260236',
  SESSION_DIR: process.env.SESSION_DIR || './session',
  SESSION_ID: process.env.SESSION_ID || '',
  NO_PREFIX: process.env.NO_PREFIX === 'true',
  STATUS_VIEW: process.env.STATUS_VIEW === 'true',
  updateZipUrl: "https://codeload.github.com/gifteddevsmd/Dave-Ai/zip/refs/heads/main",
  WARN_COUNT: 3,
  APIs: global.APIs,
  APIKeys: global.APIKeys
};