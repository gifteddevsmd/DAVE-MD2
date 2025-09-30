const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function viewonceCommand(context) {
    const { client, m } = context;

    if (!m.quoted) return;

    const quotedMessage = m.msg?.contextInfo?.quotedMessage;

    try {
        if (quotedMessage?.imageMessage) {
            const imageUrl = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
            await client.sendMessage(client.user.id, { 
                image: { url: imageUrl },
                caption: "Rҽƚɾιҽʋҽԃ Ⴆყ 𝙳𝙰𝚅𝙴-𝙼𝙳"
            });
        } else if (quotedMessage?.videoMessage) {
            const videoUrl = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
            await client.sendMessage(client.user.id, {
                video: { url: videoUrl },
                caption: "Rҽƚɾιҽʋҽԃ Ⴆყ 𝙳𝙰𝚅𝙴-𝙼𝙳"
            });
        }
    } catch (error) {
        console.error("Error in viewonceCommand:", error);
    }
}

module.exports = viewonceCommand;