const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `🤖 *➤ ✦ 𝙊𝙪𝙩 𝙤𝙛 𝙥𝙡𝙖𝙣, 𝙤𝙪𝙩 𝙤𝙛 𝙗𝙪𝙨𝙞𝙣𝙚𝙨𝙨 ✦
!*\n\n` +
                        `✨ *Version:* ${settings.version}\n` +
                        `🟢 *Status:* Running Smoothly\n\n` +
                        `📌 Type *.menu* to see all commands.`;

        await sock.sendMessage(chatId, {
            text: message1,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400480173280@newsletter',
                    newsletterName: '𝙳𝙰𝚅𝙴-𝙼𝙳 Updates',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '✅ 𝙳𝙰𝚅𝙴-𝙼𝙳 is alive!' }, { quoted: message });
    }
}

module.exports = aliveCommand;