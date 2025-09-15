const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '@newsletter',
            newsletterName: '𝐃𝐀𝐕𝐄-𝐌𝐃',
            serverMessageId: -1
        }
    }
};

async function viewOnceCommand(sock, chatId, message) {
    try {
        // ✅ Resolve owner JID
        const ownerNumber = (process.env.OWNER_NUMBER || settings.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
        const ownerJid = `${ownerNumber}@s.whatsapp.net`;

        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
            message.message?.imageMessage ||
            message.message?.videoMessage;

        if (!quotedMessage) {
            await sock.sendMessage(chatId, { 
                text: '😒 _Please reply to a view once message!_',
                ...channelInfo
            });
            return;
        }

        const isViewOnceImage =
            quotedMessage.imageMessage?.viewOnce === true ||
            quotedMessage.viewOnceMessage?.message?.imageMessage ||
            message.message?.viewOnceMessage?.message?.imageMessage;

        const isViewOnceVideo =
            quotedMessage.videoMessage?.viewOnce === true ||
            quotedMessage.viewOnceMessage?.message?.videoMessage ||
            message.message?.viewOnceMessage?.message?.videoMessage;

        let mediaMessage;
        if (isViewOnceImage) {
            mediaMessage =
                quotedMessage.imageMessage ||
                quotedMessage.viewOnceMessage?.message?.imageMessage ||
                message.message?.viewOnceMessage?.message?.imageMessage;
        } else if (isViewOnceVideo) {
            mediaMessage =
                quotedMessage.videoMessage ||
                quotedMessage.viewOnceMessage?.message?.videoMessage ||
                message.message?.viewOnceMessage?.message?.videoMessage;
        }

        if (!mediaMessage) {
            await sock.sendMessage(chatId, { 
                text: '🥲 Could not detect view once message! Please make sure you replied to a view once image/video.',
                ...channelInfo
            });
            return;
        }

        // ✅ Handle ViewOnce Image
        if (isViewOnceImage) {
            try {
                const stream = await downloadContentFromMessage(mediaMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                const caption = mediaMessage.caption || '';

                // Send ONLY to owner inbox
                await sock.sendMessage(ownerJid, { 
                    image: buffer,
                    caption: `*🔓 ViewOnce Unlocked*\n\n📸 *Image*\n${caption ? `📝 *Caption:* ${caption}` : ''}`
                });

                return;
            } catch (err) {
                await sock.sendMessage(chatId, { 
                    text: `🛑 Failed to process view once image!\nError: ${err.message}`,
                    ...channelInfo
                });
                return;
            }
        }

        // ✅ Handle ViewOnce Video
        if (isViewOnceVideo) {
            try {
                const tempDir = path.join(__dirname, '../temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

                const tempFile = path.join(tempDir, `temp_${Date.now()}.mp4`);
                const stream = await downloadContentFromMessage(mediaMessage, 'video');
                const writeStream = fs.createWriteStream(tempFile);

                for await (const chunk of stream) writeStream.write(chunk);
                writeStream.end();

                await new Promise((resolve) => writeStream.on('finish', resolve));

                const caption = mediaMessage.caption || '';

                // Send ONLY to owner inbox
                await sock.sendMessage(ownerJid, { 
                    video: fs.readFileSync(tempFile),
                    caption: `*🔓 ViewOnce Unlocked*\n\n🎥 *Video*\n${caption ? `📝 *Caption:* ${caption}` : ''}`
                });

                fs.unlinkSync(tempFile);
                return;
            } catch (err) {
                await sock.sendMessage(chatId, { 
                    text: `🛑 Failed to process view once video!\nError: ${err.message}`,
                    ...channelInfo
                });
                return;
            }
        }

        // Not view once
        await sock.sendMessage(chatId, { 
            text: '😒 This is not a view once message! Please reply to a view once image/video.',
            ...channelInfo
        });

    } catch (error) {
        await sock.sendMessage(chatId, { 
            text: `🛑 Error processing view once message!\nError: ${error.message}`,
            ...channelInfo
        });
    }
}

module.exports = viewOnceCommand;