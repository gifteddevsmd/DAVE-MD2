const axios = require('axios');
const crypto = require('crypto');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core'); // ✅ Fallback
const util = require('util');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);

const savetube = {
    api: {
        base: "https://media.savetube.me/api",
        cdn: "/random-cdn",
        info: "/v2/info",
        download: "/download"
    },
    headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://yt.savetube.me',
        'referer': 'https://yt.savetube.me/',
        'user-agent': 'Postify/1.0.0'
    },
    formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],
    crypto: {
        hexToBuffer: (hexString) => {
            const matches = hexString.match(/.{1,2}/g);
            return Buffer.from(matches.join(''), 'hex');
        },
        decrypt: async (enc) => {
            const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
            const data = Buffer.from(enc, 'base64');
            const iv = data.slice(0, 16);
            const content = data.slice(16);
            const key = savetube.crypto.hexToBuffer(secretKey);
            const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            let decrypted = decipher.update(content);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return JSON.parse(decrypted.toString());
        }
    },
    youtube: url => {
        if (!url) return null;
        const patterns = [
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/
        ];
        for (let p of patterns) {
            if (p.test(url)) return url.match(p)[1];
        }
        return null;
    },
    request: async (endpoint, data = {}, method = 'post') => {
        const { data: response } = await axios({
            method,
            url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
            data: method === 'post' ? data : undefined,
            params: method === 'get' ? data : undefined,
            headers: savetube.headers
        });
        return { status: true, code: 200, data: response };
    },
    getCDN: async () => {
        const response = await savetube.request(savetube.api.cdn, {}, 'get');
        return { status: true, code: 200, data: response.data.cdn };
    },
    download: async (link, format) => {
        if (!link) throw new Error('No link provided');
        if (!format || !savetube.formats.includes(format)) throw new Error('Invalid format');
        const id = savetube.youtube(link);
        if (!id) throw new Error('Invalid YouTube link');
        const cdnx = await savetube.getCDN();
        const cdn = cdnx.data;
        const result = await savetube.request(`https://${cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=${id}` });
        const decrypted = await savetube.crypto.decrypt(result.data.data);
        const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
            id,
            downloadType: format === 'mp3' ? 'audio' : 'video',
            quality: format === 'mp3' ? '128' : format,
            key: decrypted.key
        });
        return {
            status: true,
            result: {
                title: decrypted.title,
                type: format === 'mp3' ? 'audio' : 'video',
                format,
                thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/0.jpg`,
                download: dl.data.data.downloadUrl,
                id,
                duration: decrypted.duration
            }
        };
    }
};

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        if (!searchQuery) {
            return await sock.sendMessage(chatId, { text: "What song do you want to download?" });
        }

        let videoUrl;
        if (searchQuery.startsWith('http')) {
            videoUrl = searchQuery;
        } else {
            const { videos } = await yts(searchQuery);
            if (!videos?.length) return await sock.sendMessage(chatId, { text: "No songs found!" });
            videoUrl = videos[0].url;
        }

        let result;
        try {
            result = await savetube.download(videoUrl, 'mp3');
        } catch (err) {
            console.log('SaveTube failed, switching to fallback...');
            // ✅ Fallback using ytdl-core
            const info = await ytdl.getInfo(videoUrl);
            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            result = {
                status: true,
                result: {
                    title: info.videoDetails.title,
                    thumbnail: info.videoDetails.thumbnails.pop().url,
                    download: audioFormat.url
                }
            };
        }

        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const tempFile = path.join(tempDir, `${Date.now()}.mp3`);

        let sentMsg;
        try {
            sentMsg = await sock.sendMessage(chatId, {
                image: { url: result.result.thumbnail },
                caption: `*${result.result.title}*\n\n_Downloading song..._ 🎶`
            }, { quoted: message });
        } catch {
            sentMsg = message;
        }

        const response = await axios({ url: result.result.download, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        await sock.sendMessage(chatId, {
            audio: { url: tempFile },
            mimetype: "audio/mpeg",
            fileName: `${result.result.title}.mp3`
        }, { quoted: sentMsg });

        setTimeout(() => fs.existsSync(tempFile) && fs.unlinkSync(tempFile), 5000);
    } catch (error) {
        console.error('Song Command Error:', error.message);
        await sock.sendMessage(chatId, { text: "Download failed. Please try again later." });
    }
}

module.exports = songCommand;