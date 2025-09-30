const { isAdmin } = require('../lib/isAdmin');

// Function to handle manual promotions via command
async function promoteCommand(sock, chatId, mentionedJids, message) {
    let userToPromote = [];

    // Check for mentioned users
    if (mentionedJids && mentionedJids.length > 0) {
        userToPromote = mentionedJids;
    }
    // Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToPromote = [message.message.extendedTextMessage.contextInfo.participant];
    }

    // If no user found through either method
    if (userToPromote.length === 0) {
        await sock.sendMessage(chatId, { 
            text: 'Please mention the user or reply to their message to promote!'},{ quoted: message });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(chatId, userToPromote, "promote");

        // Get usernames for each promoted user
        const usernames = userToPromote.map(jid => `@${jid.split('@')[0]}`);

        // Get promoter's JID (who sent the command)
        const promoterJid = message.key.participant || message.key.remoteJid;

        const promotionMessage = 
            `✧ *Promoted User${userToPromote.length > 1 ? 's' : ''}:*\n` +
            `${usernames.map(name => `• ${name}`).join('\n')}\n` +
            `✧ *Promoted By:* @${promoterJid.split('@')[0]}\n` +
            `✧ *Date:* ${new Date().toLocaleString()}`;

        await sock.sendMessage(chatId, { 
            text: promotionMessage,
            mentions: [...userToPromote, promoterJid]
        });
    } catch (error) {
        console.error('Error in promote command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to promote user(s)!'},{ quoted: message });
    }
}

// Function to handle automatic promotion detection (only if bot did it)
async function handlePromotionEvent(sock, groupId, participants, author) {
    try {
        if (!groupId || !participants) {
            console.log('Invalid groupId or participants:', { groupId, participants });
            return;
        }

        // ✅ Only notify if promotion was done by the bot
        const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
        if (!author || author !== botJid) {
            console.log(`Ignoring promotion event (not bot action). Author: ${author}`);
            return;
        }

        // Get usernames for promoted participants
        const promotedUsernames = participants.map(jid => `@${jid.split('@')[0]}`);

        const promotionMessage = 
            `✧ *Promoted User${participants.length > 1 ? 's' : ''}:*\n` +
            `${promotedUsernames.map(name => `• ${name}`).join('\n')}\n` +
            `✧ *Promoted By:* @${author.split('@')[0]}\n` +
            `✧ *Date:* ${new Date().toLocaleString()}`;

        await sock.sendMessage(groupId, {
            text: promotionMessage,
            mentions: [...participants, author]
        });
    } catch (error) {
        console.error('Error handling promotion event:', error);
    }
}

module.exports = { promoteCommand, handlePromotionEvent };
