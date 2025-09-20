const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

const messageStore = new Map();
const CONFIG_PATH = path.join(__dirname, '../data/antidelete.json');
const TEMP_MEDIA_DIR = path.join(__dirname, '../tmp');

// Ensure tmp dir exists
if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

function loadAntideleteConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH))
            return { enabled: false, mode: 'private' };
        return JSON.parse(fs.readFileSync(CONFIG_PATH));
    } catch {
        return { enabled: false, mode: 'private' };
    }
}

function saveAntideleteConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (err) {
        console.error('Config save error:', err);
    }
}

async function handleAntideleteCommand(sock, chatId, message, match) {
    if (!message.key.fromMe) {
        return sock.sendMessage(chatId, { text: '*Only the bot owner can use this command.*' });
    }

    const config = loadAntideleteConfig();

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `*ANTIDELETE SETUP*\n\nStatus: ${config.enabled ? '✅ ON' : '❌ OFF'}\nMode: ${config.mode === 'public' ? '🌍 PUBLIC' : '🔒 PRIVATE'}\n\n` +
                `*.antidelete private on* - Enabled (send only to owner)\n` +
                `*.antidelete public on* - Enabled (send to current chat)\n` +
                `*.antidelete off* - Disable`
        });
    }

    if (match === 'off') {
        config.enabled = false;
    } else if (match === 'private on') {
        config.enabled = true;
        config.mode = 'private';
    } else if (match === 'public on') {
        config.enabled = true;
        config.mode = 'public';
    } else {
        return sock.sendMessage(chatId, { text: '*Invalid usage. Try .antidelete private on / public on / off*' });
    }

    saveAntideleteConfig(config);
    return sock.sendMessage(chatId, { text: `*Antidelete ${config.enabled ? `${config.mode.toUpperCase()} MODE ENABLED ✅` : 'DISABLED ❌'}*` });
}

// Store incoming messages
async function storeMessage(message) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled) return;

        if (!message.key?.id) return;
        const messageId = message.key.id;

        let content = '';
        let mediaType = '';
        let mediaPath = '';

        const sender = message.key.participant || message.key.remoteJid;

        if (message.message?.conversation) {
            content = message.message.conversation;
        } else if (message.message?.extendedTextMessage?.text) {
            content = message.message.extendedTextMessage.text;
        } else if (message.message?.imageMessage) {
            mediaType = 'image';
            content = message.message.imageMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.imageMessage, 'image');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.stickerMessage) {
            mediaType = 'sticker';
            const buffer = await downloadContentFromMessage(message.message.stickerMessage, 'sticker');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.webp`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.videoMessage) {
            mediaType = 'video';
            content = message.message.videoMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.videoMessage, 'video');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
            await writeFile(mediaPath, buffer);
        }

        messageStore.set(messageId, {
            content,
            mediaType,
            mediaPath,
            sender,
            chat: message.key.remoteJid,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('storeMessage error:', err);
    }
}

async function handleMessageRevocation(sock, revocationMessage) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled) return;

        const messageId = revocationMessage.message.protocolMessage.key.id;
        const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;

        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        if (deletedBy === botJid) return; // Ignore if bot itself deleted

        const original = messageStore.get(messageId);
        if (!original) return;

        // ✅ Ignore if you deleted your own message
        if (deletedBy === original.sender && original.sender === botJid) return;

        const sender = original.sender;
        const senderName = sender.split('@')[0];
        const chat = original.chat;

        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Africa/Nairobi',
            hour12: true,
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        let text = `*🔰 ANTIDELETE REPORT 🔰*\n\n` +
            `*🗑️ Deleted By:* @${deletedBy.split('@')[0]}\n` +
            `*👤 Sender:* @${senderName}\n` +
            `*🕒 Time:* ${time}\n`;

        if (original.content) text += `\n*💬 Deleted Message:*\n${original.content}`;

        // ✅ Determine where to send
        const targetJid = config.mode === 'public' ? chat : botJid;

        await sock.sendMessage(targetJid, {
            text,
            mentions: [deletedBy, sender]
        });

        // Send media if available
        if (original.mediaType && fs.existsSync(original.mediaPath)) {
            const mediaOptions = {
                caption: `*Deleted ${original.mediaType}*\nFrom: @${senderName}`,
                mentions: [sender]
            };

            try {
                if (original.mediaType === 'image')
                    await sock.sendMessage(targetJid, { image: { url: original.mediaPath }, ...mediaOptions });
                if (original.mediaType === 'sticker')
                    await sock.sendMessage(targetJid, { sticker: { url: original.mediaPath }, ...mediaOptions });
                if (original.mediaType === 'video')
                    await sock.sendMessage(targetJid, { video: { url: original.mediaPath }, ...mediaOptions });
            } catch (err) {
                console.error('Media send error:', err);
            }

            try { fs.unlinkSync(original.mediaPath); } catch {}
        }

        messageStore.delete(messageId);

    } catch (err) {
        console.error('handleMessageRevocation error:', err);
    }
}

module.exports = {
    handleAntideleteCommand,
    handleMessageRevocation,
    storeMessage
};