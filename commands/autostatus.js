const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '@newsletter',
            newsletterName: '𝙳𝙰𝚅𝙴-𝙼𝙳',
            serverMessageId: -1
        }
    }
};

// Path to store auto status configuration
const configPath = path.join(__dirname, '../data/autoStatus.json');

// Initialize config file if it doesn't exist
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ 
        enabled: false, 
        reactOn: false,
        emoji: "💚" // default emoji
    }));
}

async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: 'This command can only be used by the owner!',
                ...channelInfo
            });
            return;
        }

        let config = JSON.parse(fs.readFileSync(configPath));

        if (!args || args.length === 0) {
            const status = config.enabled ? 'enabled' : 'disabled';
            const reactStatus = config.reactOn ? `enabled (emoji: ${config.emoji})` : 'disabled';
            await sock.sendMessage(chatId, { 
                text: `🔄 *Auto Status Settings*\n\n📱 *Auto Status View:* ${status}\n💫 *Status Reactions:* ${reactStatus}\n\n*Commands:*\n.autostatus on - Enable auto status view\n.autostatus off - Disable auto status view\n.autostatus react on/off - Enable/disable reactions\n.autostatus emoji ❤️ - Change reaction emoji`,
                ...channelInfo
            });
            return;
        }

        const command = args[0].toLowerCase();

        if (command === 'on') {
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: '✅ Auto status view has been enabled!',
                ...channelInfo
            });
        } else if (command === 'off') {
            config.enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: '❌ Auto status view has been disabled!',
                ...channelInfo
            });
        } else if (command === 'react') {
            if (!args[1]) {
                await sock.sendMessage(chatId, { 
                    text: 'Please specify on/off for reactions!\nUse: .autostatus react on/off',
                    ...channelInfo
                });
                return;
            }
            const reactCommand = args[1].toLowerCase();
            config.reactOn = reactCommand === 'on';
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: config.reactOn 
                    ? `💫 Status reactions have been enabled! (emoji: ${config.emoji})`
                    : '❌ Status reactions have been disabled!',
                ...channelInfo
            });
        } else if (command === 'emoji') {
            if (!args[1]) {
                await sock.sendMessage(chatId, { 
                    text: 'Please provide an emoji!\nExample: .autostatus emoji 😂',
                    ...channelInfo
                });
                return;
            }
            config.emoji = args[1];
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: `✅ Status reaction emoji updated to: ${config.emoji}`,
                ...channelInfo
            });
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Invalid command! Use:\n.autostatus on/off\n.autostatus react on/off\n.autostatus emoji ❤️',
                ...channelInfo
            });
        }

    } catch (error) {
        console.error('Error in autostatus command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error occurred while managing auto status!\n' + error.message,
            ...channelInfo
        });
    }
}

function getConfig() {
    try {
        return JSON.parse(fs.readFileSync(configPath));
    } catch (e) {
        return { enabled: false, reactOn: false, emoji: "💚" };
    }
}

function isAutoStatusEnabled() {
    return getConfig().enabled;
}

function isStatusReactionEnabled() {
    return getConfig().reactOn;
}

async function reactToStatus(sock, statusKey) {
    try {
        const config = getConfig();
        if (!config.reactOn) return;

        // random delay 1-3s to avoid spamming
        const delay = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        await sock.sendMessage('status@broadcast', {
            react: {
                text: config.emoji,
                key: statusKey
            }
        });
    } catch (error) {
        console.error('❌ Error reacting to status:', error.message);
    }
}

async function handleStatusUpdate(sock, status) {
    try {
        if (!isAutoStatusEnabled()) return;

        await new Promise(resolve => setTimeout(resolve, 1000)); // small delay before reading

        if (status.messages && status.messages.length > 0) {
            const msg = status.messages[0];
            if (msg.key && msg.key.remoteJid === 'status@broadcast') {
                await sock.readMessages([msg.key]);
                await reactToStatus(sock, msg.key);
                return;
            }
        }

        if (status.key && status.key.remoteJid === 'status@broadcast') {
            await sock.readMessages([status.key]);
            await reactToStatus(sock, status.key);
            return;
        }

        if (status.reaction && status.reaction.key.remoteJid === 'status@broadcast') {
            await sock.readMessages([status.reaction.key]);
            await reactToStatus(sock, status.reaction.key);
            return;
        }

    } catch (error) {
        console.error('❌ Error in auto status view:', error.message);
    }
}

module.exports = {
    autoStatusCommand,
    handleStatusUpdate
};