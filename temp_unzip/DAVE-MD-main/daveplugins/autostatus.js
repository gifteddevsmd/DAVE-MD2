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

// Initialize config file if missing or broken
function initConfig() {
    const defaultConfig = {
        enabled: false,
        reactOn: false,
        emoji: "💚"
    };

    try {
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
        }

        const content = fs.readFileSync(configPath);
        return JSON.parse(content);
    } catch (e) {
        // fallback if corrupted
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
}

function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ This command can only be used by the bot owner!',
                ...channelInfo
            });
            return;
        }

        let config = initConfig();

        if (!args || args.length === 0) {
            const status = config.enabled ? '✅ Enabled' : '❌ Disabled';
            const reactStatus = config.reactOn 
                ? `✅ Enabled (Emoji: ${config.emoji})` 
                : '❌ Disabled';

            await sock.sendMessage(chatId, { 
                text: `🔄 *Auto Status Settings*\n\n📱 *Auto Status View:* ${status}\n💫 *Status Reactions:* ${reactStatus}\n\n*Available Commands:*\n.autostatus on - Enable auto status view\n.autostatus off - Disable auto status view\n.autostatus react on/off - Enable or disable reactions\n.autostatus emoji ❤️ - Change default reaction emoji`,
                ...channelInfo
            });
            return;
        }

        const command = args[0].toLowerCase();

        if (command === 'on') {
            config.enabled = true;
            saveConfig(config);
            await sock.sendMessage(chatId, { 
                text: '✅ Auto status view has been enabled!',
                ...channelInfo
            });

        } else if (command === 'off') {
            config.enabled = false;
            saveConfig(config);
            await sock.sendMessage(chatId, { 
                text: '❌ Auto status view has been disabled!',
                ...channelInfo
            });

        } else if (command === 'react') {
            if (!args[1]) {
                await sock.sendMessage(chatId, { 
                    text: 'Please specify `on` or `off`\nExample: `.autostatus react on`',
                    ...channelInfo
                });
                return;
            }
            const reactCommand = args[1].toLowerCase();
            config.reactOn = reactCommand === 'on';
            saveConfig(config);
            await sock.sendMessage(chatId, { 
                text: config.reactOn 
                    ? `💫 Status reactions enabled! Current emoji: ${config.emoji}`
                    : '❌ Status reactions disabled!',
                ...channelInfo
            });

        } else if (command === 'emoji') {
            if (!args[1]) {
                await sock.sendMessage(chatId, { 
                    text: 'Please provide an emoji!\nExample: `.autostatus emoji 😂`',
                    ...channelInfo
                });
                return;
            }
            config.emoji = args[1];
            saveConfig(config);
            await sock.sendMessage(chatId, { 
                text: `✅ Status reaction emoji updated to: ${config.emoji}`,
                ...channelInfo
            });

        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Invalid command!\nUse:\n.autostatus on/off\n.autostatus react on/off\n.autostatus emoji ❤️',
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
    return initConfig();
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

        await new Promise(resolve => setTimeout(resolve, 1000)); // delay before marking as read

        if (status.messages?.length) {
            const msg = status.messages[0];
            if (msg.key?.remoteJid === 'status@broadcast') {
                await sock.readMessages([msg.key]);
                await reactToStatus(sock, msg.key);
            }
            return;
        }

        if (status.key?.remoteJid === 'status@broadcast') {
            await sock.readMessages([status.key]);
            await reactToStatus(sock, status.key);
            return;
        }

        if (status.reaction?.key?.remoteJid === 'status@broadcast') {
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