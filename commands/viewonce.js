const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

// Channel info for message context
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

        const isViewOnceImage = quotedMessage.imageMessage?.viewOnce === true || 
                              quotedMessage.viewOnceMessage?.message?.imageMessage ||
                              message.message?.viewOnceMessage?.message?.imageMessage;

        const isViewOnceVideo = quotedMessage.videoMessage?.viewOnce === true || 
                              quotedMessage.viewOnceMessage?.message?.videoMessage ||
                              message.message?.viewOnceMessage?.message?.videoMessage;

        let mediaMessage;
        if (isViewOnceImage) {
            mediaMessage = quotedMessage.imageMessage || 
                         quotedMessage.viewOnceMessage?.message?.imageMessage ||
                         message.message?.viewOnceMessage?.message?.imageMessage;
        } else if (isViewOnceVideo) {
            mediaMessage = quotedMessage.videoMessage || 
                         quotedMessage.viewOnceMessage?.message?.videoMessage ||
                         message.message?.viewOnceMessage?.message?.videoMessage;
        }

        if (!mediaMessage) {
            console.log('Message structure:', JSON.stringify(message, null, 2));
            await sock.sendMessage(chatId, { 
                text: '🥲 Could not detect view once message! Please make sure you replied to a view once image/video.',
                ...channelInfo
            });
            return;
        }

        // Handle view once image
        if (isViewOnceImage) {
            try {
                console.log('📸 Processing view once image...');
                const stream = await downloadContentFromMessage(mediaMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                const caption = mediaMessage.caption || '';

                await sock.sendMessage(ownerJid, { 
                    image: buffer,
                    caption: `*𝐃𝐀𝐕𝐄-𝐌𝐃*\n\n*ViewOnce:* Image 📸\n${caption ? `*Caption:* ${caption}` : ''}`
                });

                // ❌ Removed "console.log('_View once image sent to owner inbox_')" 
                // ❌ Removed any chat confirmation
                return;
            } catch (err) {
                console.error('🛑 Error downloading image:', err);
                await sock.sendMessage(chatId, { 
                    text: '🛑 Failed to process view once image! Error: ' + err.message,
                    ...channelInfo
                });
                return;
            }
        }

        // Handle view once video
        if (isViewOnceVideo) {
            try {
                console.log('Processing view once video...');
                const tempDir = path.join(__dirname, '../temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

                const tempFile = path.join(tempDir, `temp_${Date.now()}.mp4`);
                const stream = await downloadContentFromMessage(mediaMessage, 'video');
                const writeStream = fs.createWriteStream(tempFile);

                for await (const chunk of stream) writeStream.write(chunk);
                writeStream.end();

                await new Promise((resolve) => writeStream.on('finish', resolve));

                const caption = mediaMessage.caption || '';

                await sock.sendMessage(ownerJid, { 
                    video: fs.readFileSync(tempFile),
                    caption: `*𝐃𝐀𝐕𝐄-𝐌𝐃*\n\n*ViewOnce:* Video 📹\n${caption ? `*Caption:* ${caption}` : ''}`
                });

                fs.unlinkSync(tempFile);
                // ❌ Removed "console.log('View once video sent to owner inbox')" 
                // ❌ No chat confirmation
                return;
            } catch (err) {
                console.error('🛑 Error processing video:', err);
                await sock.sendMessage(chatId, { 
                    text: '🛑 Failed to process view once video! Error: ' + err.message,
                    ...channelInfo
                });
                return;
            }
        }

        await sock.sendMessage(chatId, { 
            text: '😒 This is not a view once message! Please reply to a view once image/video.',
            ...channelInfo
        });

    } catch (error) {
        console.error('🛑 Error in viewonce command:', error);
        await sock.sendMessage(chatId, { 
            text: '🛑 Error processing view once message! Error: ' + error.message,
            ...channelInfo
        });
    }
}

module.exports = viewOnceCommand;