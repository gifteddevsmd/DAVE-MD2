const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require('os');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function helpCommand(sock, chatId, message) {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: '_getting daves menu..._' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);
    const helpMessage = `

┏▣ ◈ *DAVE-MD* ◈
┃ *ᴏᴡɴᴇʀ* : ${settings.botOwner}
┃ *ᴜᴘᴛɪᴍᴇ* : ${uptimeFormatted}
┃ *ᴛɪᴍᴇ* : ${new Date().toLocaleString()}
┃ *sᴘᴇᴇᴅ* : ${ping} ms
┃ *ᴠᴇʀsɪᴏɴ* : ${settings.version}
┗▣ 

┏▣ ◈ *AI MENU* ◈
│➤ analyze
│➤ blackbox
│➤ dalle
│➤ gemini
│➤ generate
│➤ deepseek
│➤ deepseekr1
│➤ doppleai
│➤ gpt
│➤ gpt2
│➤ imagen
│➤ imagine
│➤ llama
│➤ metaai
│➤ mistral
│➤ photoai
│➤ programming
│➤ translate2
│➤ summarize
│➤ story
│➤ recipe
│➤ teach
┗▣ 

┏▣ ◈ *AUDIO MENU* ◈
│➤ bass
│➤ blown
│➤ deep
│➤ earrape
│➤ reverse
│➤ robot
│➤ volaudio
│➤ tomp3
│➤ toptt
┗▣ 

┏▣ ◈ *DOWNLOAD MENU* ◈
│➤ apk
│➤ download
│➤ facebook
│➤ gdrive
│➤ gitclone
│➤ image
│➤ instagram
│➤ itunes
│➤ mediafire
│➤ song
│➤ song2
│➤ play
│➤ play2
│➤ savestatus
│➤ telesticker
│➤ tiktok
│➤ tiktokaudio
│➤ twitter
│➤ video
│➤ videodoc
│➤ xvideos
│➤ ytmp3
│➤ ytmp3doc
┗▣ 

┏▣ ◈ *EPHOTO360 MENU* ◈
│➤ 1917style
│➤ advancedglow
│➤ blackpinklogo
│➤ blackpinkstyle
│➤ cartoonstyle
│➤ deletingtext
│➤ dragonball
│➤ effectclouds
│➤ flag3dtext
│➤ flagtext
│➤ freecreate
│➤ galaxystyle
│➤ galaxywallpaper
│➤ glitchtext
│➤ glowingtext
│➤ gradienttext
│➤ graffiti
│➤ incandescent
│➤ lighteffects
│➤ logomaker
│➤ luxurygold
│➤ makingneon
│➤ matrix
│➤ multicoloredneon
│➤ neonglitch
│➤ papercutstyle
│➤ pixelglitch
│➤ royaltext
│➤ sand
│➤ summerbeach
│➤ topography
│➤ typography
│➤ watercolortext
│➤ writetext
┗▣ 

┏▣ ◈ *FUN MENU* ◈
│➤ fact
│➤ jokes
│➤ memes
│➤ quotes
│➤ trivia
│➤ truthdetector
│➤ xxqc
┗▣ 

┏▣ ◈ *GAMES MENU* ◈
│➤ truth
│➤ dare
│➤ truthordare
┗▣ 

┏▣ ◈ *GROUP MENU* ◈
│➤ add
│➤ antibadword
│➤ antibot
│➤ antitag
│➤ antitagadmin
│➤ antigroupmention
│➤ antilink
│➤ antilinkgc
│➤ allow
│➤ delallowed
│➤ listallowed
│➤ announcements
│➤ antidemote
│➤ antiforeign
│➤ addcode
│➤ delcode
│➤ listcode
│➤ listactive
│➤ listinactive
│➤ kickinactive
│➤ kickall
│➤ cancelkick
│➤ antipromote
│➤ welcome
│➤ approveall
│➤ close
│➤ delppgroup
│➤ demote
│➤ disapproveall
│➤ getgrouppp
│➤ editsettings
│➤ link
│➤ hidetag
│➤ invite
│➤ kick
│➤ listonline
│➤ listrequests
│➤ mediatag
│➤ open
│➤ closetime
│➤ opentime
│➤ poll
│➤ promote
│➤ resetlink
│➤ setdesc
│➤ setgroupname
│➤ setppgroup
│➤ tagadmin
│➤ tagall
│➤ totalmembers
│➤ userid
│➤ vcf
┗▣ 

┏▣ ◈ *IMAGE MENU* ◈
│➤ remini
│➤ wallpaper
┗▣ 

┏▣ ◈ *OTHER MENU* ◈
│➤ botstatus
│➤ pair
│➤ ping
│➤ runtime
│➤ repo
│➤ time
┗▣ 

┏▣ ◈ *OWNER MENU* ◈
│➤ block
│➤ delete
│➤ deljunk
│➤ disk
│➤ dlvo
│➤ gcaddprivacy
│➤ groupid
│➤ hostip
│➤ join
│➤ lastseen
│➤ leave
│➤ listbadword
│➤ listblocked
│➤ listignorelist
│➤ listsudo
│➤ modestatus
│➤ online
│➤ owner
│➤ ppprivacy
│➤ react
│➤ readreceipts
│➤ restart
│➤ setbio
│➤ setprofilepic
│➤ setstickercmd
│➤ delstickercmd
│➤ tostatus
│➤ toviewonce
│➤ unblock
│➤ unblockall
│➤ warn
┗▣ 

┏▣ ◈ *RELIGION MENU* ◈
│➤ bible
│➤ quran
┗▣ 

┏▣ ◈ *SEARCH MENU* ◈
│➤ define
│➤ define2
│➤ imdb
│➤ lyrics
│➤ shazam
│➤ weather
│➤ yts
┗▣ 

┏▣ ◈ *SETTINGS MENU* ◈
│➤ addbadword
│➤ addignorelist
│➤ addsudo
│➤ alwaysonline
│➤ antibug
│➤ anticall
│➤ antidelete
│➤ antideletestatus
│➤ antiedit
│➤ autobio
│➤ autoreactstatus
│➤ autoviewstatus
│➤ autoreact
│➤ autoread
│➤ autotype
│➤ autorerecord
│➤ autorecordtyping
│➤ autoblock
│➤ addcountrycode
│➤ delcountrycode
│➤ listcountrycode
│➤ chatbot
│➤ deletebadword
│➤ delignorelist
│➤ delsudo
│➤ mode
│➤ setmenu
│➤ setprefix
│➤ setstatusemoji
│➤ setbotname
│➤ setownername
│➤ setfont
│➤ setownernumber
│➤ setwatermark
│➤ setstickerauthor
│➤ setstickerpackname
│➤ settimezone
│➤ setcontextlink
│➤ setmenuimage
│➤ setanticallmsg
│➤ showanticallmsg
│➤ delanticallmsg
│➤ testanticallmsg
│➤ getsettings
│➤ resetwarn
│➤ setwarn
│➤ listwarn
│➤ resetsetting
┗▣ 

┏▣ ◈ *SPORTS MENU* ◈
│➤ clstandings
│➤ laligastandings
│➤ bundesligastandings
│➤ serieastandings
│➤ ligue1standings
│➤ elstandings
│➤ eflstandings
│➤ wcstandings
│➤ eplstandings
│➤ eplmatches
│➤ clmatches
│➤ laligamatches
│➤ bundesligamatches
│➤ serieamatches
│➤ ligue1matches
│➤ elmatches
│➤ eflmatches
│➤ wcmatches
│➤ eplscorers
│➤ clscorers
│➤ laligascorers
│➤ bundesligascorers
│➤ serieascorers
│➤ ligue1scorers
│➤ elscorers
│➤ eflscorers
│➤ wcscorers
│➤ eplupcoming
│➤ clupcoming
│➤ laligaupcoming
│➤ bundesligaupcoming
│➤ serieaupcoming
│➤ ligue1upcoming
│➤ elupcoming
│➤ eflupcoming
│➤ wcupcoming
│➤ wrestlingevents
│➤ wwenews
│➤ wweschedule
┗▣ 

┏▣ ◈ *SUPPORT MENU* ◈
│➤ feedback
│➤ helpers
┗▣ 

┏▣ ◈ *TOOLS MENU* ◈
│➤ browse
│➤ calculate
│➤ getpp
│➤ getabout
│➤ emojimix
│➤ fliptext
│➤ gsmarena
│➤ genpass
│➤ device
│➤ obfuscate
│➤ filtervcf
│➤ qrcode
│➤ say
│➤ ssweb
│➤ sswebpc
│➤ sswebtab
│➤ sticker
│➤ fancy
│➤ take
│➤ tinyurl
│➤ toimage
│➤ tourl
│➤ translate
│➤ texttopdf
│➤ vcc
┗▣ 

┏▣ ◈ *VIDEO MENU* ◈
│➤ volvideo
│➤ toaudio
│➤ tovideo
┗▣`;

try {
        const imagePath = path.join(__dirname, '../assets/menu.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: false,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400480173280@newsletter',
                        newsletterName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: false,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400480173280@newsletter',
                        newsletterName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
