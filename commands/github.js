const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function githubCommand(sock, chatId, message) {
  try {
    const res = await fetch('https://api.github.com/repos/giftdee/DAVE-MD');
    if (!res.ok) throw new Error('Failed to fetch repository data');
    const json = await res.json();

    // Dave-style formatting with 🕳️
    let txt = `🕳️ *𝐃𝐀𝐕𝐄-𝐌𝐃 REPOSITORY STATUS* 🕳️\n\n`;
    txt += `🕳️ *Repository Name:* ${json.name}\n`;
    txt += `🕳️ *Watchers:* ${json.watchers_count}\n`;
    txt += `🕳️ *Repository Size:* ${(json.size / 1024).toFixed(2)} MB\n`;
    txt += `🕳️ *Last Updated:* ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `🕳️ *Repository URL:* ${json.html_url}\n`;
    txt += `🕳️ *Forks:* ${json.forks_count}\n`;
    txt += `🕳️ *Stars:* ${json.stargazers_count}\n\n`;
    txt += `🕳️ *Tip:* Show your support by forking and starring the repository!\n\n`;
    txt += `_Powered by Dave_`;

    // Use local asset image (ensure this image exists in your assets folder)
    const imgPath = path.join(__dirname, '../assets/dave_repos.jpg');

    if (fs.existsSync(imgPath)) {
      const imgBuffer = fs.readFileSync(imgPath);
      await sock.sendMessage(chatId, { 
        image: imgBuffer, 
        caption: txt 
      }, { quoted: message });
    } else {
      // Fallback to text-only if image not found
      await sock.sendMessage(chatId, { 
        text: txt 
      }, { quoted: message });
    }
  } catch (error) {
    await sock.sendMessage(chatId, { 
      text: '🕳️ Unable to retrieve repository information at this time.' 
    }, { quoted: message });
  }
}

module.exports = githubCommand;