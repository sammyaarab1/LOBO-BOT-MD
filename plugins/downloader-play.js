import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import {youtubedl, youtubedlv2} from '@bochilteam/scraper';
import {bestFormat, getUrlDl} from '../lib/y2dl.js';
import YTDL from "../lib/ytdll.js";
import fs from "fs";
const handler = async (m, {conn, command, args, text, usedPrefix}) => {
  if (!text) throw `*[❗𝐈𝐍𝐅𝐎❗] 𝙵𝙰𝙻𝚃𝙰 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴 𝙳𝙴 𝙻𝙰 𝙲𝙰𝙽𝙲𝙸𝙾𝙽 🎧, 𝙸𝙽𝙶𝚁𝙴𝚂𝙴 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙼𝙰𝚂 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴/𝚃𝙸𝚃𝚄𝙻𝙾 𝙳𝙴 𝚄𝙽𝙰 𝙲𝙰𝙽𝙲𝙸𝙾𝙽*\n\n*—◉ 𝙴𝙹𝙴𝙼𝙿𝙻𝙾:*\n*${usedPrefix + command} 𝙼𝙸𝚁𝙰𝙲𝙻𝙴*`;
  try {
    const yt_play = await search(args.join(' '));
    let additionalText = '';
    if (command === 'play') {
      additionalText = 'audio 🔉';
    } else if (command === 'play2') {
      additionalText = 'video 🎥';
    }
    const texto1 = ` prueba
⟣☘︎ 📃 *𝚃𝙸𝚃𝚄𝙻𝙾:* ${yt_play[0].title}
⟣☘︎ ⏱️ *𝙳𝚄𝚁𝙰𝙲𝙸𝙾𝙽:* ${secondString(yt_play[0].duration.seconds)}
⟣☘︎ 🧿 *𝚅𝙸𝚂𝚃𝙰𝚂:* ${`${MilesNumber(yt_play[0].views)}`}
⟣☘︎ 👤 *𝙰𝚄𝚃𝙾𝚁:* ${yt_play[0].author.name}
⟣☘︎ 🔮 *𝙲𝙰𝙽𝙰𝙻:* ${yt_play[0].author.url}
⟣☘︎ 🔗 *𝙻𝙸𝙽𝙺:* ${yt_play[0].url}\n
⟣☘︎ *_Enviando ${additionalText}, aguarde un momento．．_*`.trim();
    //conn.sendMessage(m.chat, {image: {url: yt_play[0].thumbnail}, caption: texto1}, {quoted: m});
    await conn.sendMessage(m.chat, {
text: texto1,
contextInfo: {
externalAdReply: {
title: yt_play[0].title,
body: wm,
thumbnailUrl: yt_play[0].thumbnail, 
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true
}}} , { quoted: m })
    if (command == 'play') {
      try {      
          await YTDL.mp3(yt_play[0].url).then(async (s) => {
          await fs.writeFileSync(s.meta.title + '.mp3', s.path)
          await conn.sendMessage(m.chat, {audio: fs.readFileSync(`./${s.path}`), mimetype: "audio/mpeg", fileName: `${s.meta.title || "-"}.mp3`,}, {quoted: m});
          fs.unlinkSync(`./${s.path}`);
          })
      } catch {
      try {
        let info = await ytdl.getInfo(yt_play[0].videoId);
        let format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        let buff = ytdl.downloadFromInfo(info, { format: format });
        let bufs = []
        buff.on('data', chunk => {
          bufs.push(chunk)
        })
        buff.on('end', async () => {
          let buff = Buffer.concat(bufs)
          conn.sendMessage(m.chat, {audio: buff, fileName: yt_play[0].title + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m})}}}
//conn.sendMessage(m.chat, buttonMessage, { quoted: m });
        })
      } catch {
      try {
        const formats = await bestFormat(yt_play[0].url, 'audio');
        const dl_url = await getUrlDl(formats.url);
        const buff = await getBuffer(dl_url.download);
        conn.sendMessage(m.chat, {audio: buff, fileName: yt_play[0].title + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
      } catch (errors) {
        console.log(errors);
        try {
          const q = '128kbps';
          const v = yt_play[0].url;
          const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
          const dl_url = await yt.audio[q].download();
          const ttl = await yt.title;
          const size = await yt.audio[q].fileSizeH;
          await conn.sendFile(m.chat, dl_url, ttl + '.mp3', null, m, false, {mimetype: 'audio/mpeg'});
        } catch {
          try {
            const dataRE = await fetch(`https://api.akuari.my.id/downloader/youtube?link=${yt_play[0].url}`);
            const dataRET = await dataRE.json();
            conn.sendMessage(m.chat, {audio: {url: dataRET.mp3[1].url}, fileName: yt_play[0].title + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
          } catch {
            try {
              const humanLol = await fetch(`https://api.lolhuman.xyz/api/ytplay?apikey=${lolkeysapi}&query=${yt_play[0].title}`);
              const humanRET = await humanLol.json();
              conn.sendMessage(m.chat, {audio: {url: humanRET.result.audio.link}, fileName: yt_play[0].title + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
            } catch {
              try {
                const lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkeysapi}&url=${yt_play[0].url}`);
                const lolh = await lolhuman.json();
                const n = lolh.result.title || 'error';
                await conn.sendMessage(m.chat, {audio: {url: lolh.result.link}, fileName: `${n}.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
              } catch {
                try {
                  const searchh = await yts(yt_play[0].url);
                  const __res = searchh.all.map((v) => v).filter((v) => v.type == 'video');
                  const infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
                  const ress = await ytdl.chooseFormat(infoo.formats, {filter: 'audioonly'});
                  conn.sendMessage(m.chat, {audio: {url: ress.url}, fileName: __res[0].title + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
                } catch {
                  await conn.reply(m.chat, '*[❗] 𝙴𝚁𝚁𝙾𝚁 𝙽𝙾 𝙵𝚄𝙴 𝙿𝙾𝚂𝙸𝙱𝙻𝙴 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰𝚁 𝙴𝙻 𝙰𝚄𝙳𝙸𝙾*', m);
                }
              }
            }
          }
        }
      }
    }
    }
    if (command == 'play2') {
      try {
        const qu = '360';
        const q = qu + 'p';
        const v = yt_play[0].url;
        const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
        const dl_url = await yt.video[q].download();
        const ttl = await yt.title;
        const size = await yt.video[q].fileSizeH;
        await await conn.sendMessage(m.chat, {video: {url: dl_url}, fileName: `${ttl}.mp4`, mimetype: 'video/mp4', caption: `▢ 𝚃𝙸𝚃𝚄𝙻𝙾: ${ttl}\n▢ 𝙿𝙴𝚂𝙾 𝙳𝙴𝙻 𝚅𝙸𝙳𝙴𝙾: ${size}`, thumbnail: await fetch(yt.thumbnail)}, {quoted: m});
      } catch {
        try {
          const mediaa = await ytMp4(yt_play[0].url);
          await conn.sendMessage(m.chat, {video: {url: mediaa.result}, fileName: `error.mp4`, caption: `_𝐇𝐚𝐜𝐡𝐢𝐤𝐨 - 𝐁𝐨𝐭_`, thumbnail: mediaa.thumb, mimetype: 'video/mp4'}, {quoted: m});
        } catch {
          try {
            const lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytvideo2?apikey=${lolkeysapi}&url=${yt_play[0].url}`);
            const lolh = await lolhuman.json();
            const n = lolh.result.title || 'error';
            const n2 = lolh.result.link;
            const n3 = lolh.result.size;
            const n4 = lolh.result.thumbnail;
            await conn.sendMessage(m.chat, {video: {url: n2}, fileName: `${n}.mp4`, mimetype: 'video/mp4', caption: `▢ 𝚃𝙸𝚃𝚄𝙻𝙾: ${n}\n▢ 𝙿𝙴𝚂𝙾 𝙳𝙴𝙻 𝚅𝙸𝙳𝙴𝙾: ${n3}`, thumbnail: await fetch(n4)}, {quoted: m});
          } catch {
            await conn.reply(m.chat, '*[❗] 𝙴𝚁𝚁𝙾𝚁 𝙽𝙾 𝙵𝚄𝙴 𝙿𝙾𝚂𝙸𝙱𝙻𝙴 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰𝚁 𝙴𝙻 𝚅𝙸𝙳𝙴𝙾*', m);
          }
        }
      }
    }}
  } catch {
    throw '*[❗𝐈𝐍𝐅𝐎❗] 𝙴𝚁𝚁𝙾𝚁, 𝙿𝙾𝚁 𝙵𝙰𝚅𝙾𝚁 𝚅𝚄𝙴𝙻𝚅𝙰 𝙰 𝙸𝙽𝚃𝙴𝙽𝚃𝙰𝚁𝙻𝙾*';
  }
};
handler.help = ['play', 'play2'].map((v) => v + ' < busqueda >');
handler.tags = ['downloader'];
handler.command = /^(play|play2)$/i;
export default handler;

async function search(query, options = {}) {
  const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
  return search.videos;
}

function MilesNumber(number) {
  const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  const rep = '$1.';
  const arr = number.toString().split('.');
  arr[0] = arr[0].replace(exp, rep);
  return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function bytesToSize(bytes) {
  return new Promise((resolve, reject) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) resolve(`${bytes} ${sizes[i]}`);
    resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
  });
}

async function ytMp3(url) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      const result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        const item = getUrl.formats[i];
        if (item.mimeType == 'audio/webm; codecs=\"opus\"') {
          const {contentLength} = item;
          const bytes = await bytesToSize(contentLength);
          result[i] = {audio: item.url, size: bytes};
        }
      }
      const resultFix = result.filter((x) => x.audio != undefined && x.size != undefined);
      const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].audio}`);
      const tinyUrl = tiny.data;
      const title = getUrl.videoDetails.title;
      const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({title, result: tinyUrl, result2: resultFix, thumb});
    }).catch(reject);
  });
}

async function ytMp4(url) {
  return new Promise(async (resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      const result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        const item = getUrl.formats[i];
        if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
          const {qualityLabel, contentLength} = item;
          const bytes = await bytesToSize(contentLength);
          result[i] = {video: item.url, quality: qualityLabel, size: bytes};
        }
      }
      const resultFix = result.filter((x) => x.video != undefined && x.size != undefined && x.quality != undefined);
      const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
      const tinyUrl = tiny.data;
      const title = getUrl.videoDetails.title;
      const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({title, result: tinyUrl, rersult2: resultFix[0].video, thumb});
    }).catch(reject);
  });
}

async function ytPlay(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      const result = getData.videos.slice( 0, 5 );
      const url = [];
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url);
      }
      const random = url[0];
      const getAudio = await ytMp3(random);
      resolve(getAudio);
    }).catch(reject);
  });
}

async function ytPlayVid(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      const result = getData.videos.slice( 0, 5 );
      const url = [];
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url);
      }
      const random = url[0];
      const getVideo = await ytMp4(random);
      resolve(getVideo);
    }).catch(reject);
  });
}

const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });

    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
};
