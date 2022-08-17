const request = require('request');
const fs = require('fs');
const proxyAgent = require('proxy-agent');
const ytdl = require('ytdl-core');
const path = require('path')
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const COOKIE = 'HSID=A90-J1dZizy2UKJan; SSID=AWkQdbNuRBPLKyPyg; APISID=dOTWnLiPV8cah59r/AhBmQCOyR7LRg7vPr; SAPISID=I_VDFJXp0pP3QHxA/A3Rbk9WrJTMwazjlt; __Secure-1PAPISID=I_VDFJXp0pP3QHxA/A3Rbk9WrJTMwazjlt; __Secure-3PAPISID=I_VDFJXp0pP3QHxA/A3Rbk9WrJTMwazjlt; SEARCH_SAMESITE=CgQIh5YB; SID=NQiugaAflq6v7J-NdSn5OzVC_wHN91wSDAWrzdOjMc1vzExSrwmLJ7Y54FAj9cMLyeiN_w.; __Secure-1PSID=NQiugaAflq6v7J-NdSn5OzVC_wHN91wSDAWrzdOjMc1vzExSN-euanNOJ-9zTVmWWRYBgA.; __Secure-3PSID=NQiugaAflq6v7J-NdSn5OzVC_wHN91wSDAWrzdOjMc1vzExSQhtdUkb1E1CuVB7tKDDhNA.; AEC=AakniGMxoAEi0Ve5I2QES1dJ_rsjcyX2BO-3NnP2xmZiusrQv6HpGqBgfmM; eskucgkwiu72frkqawfcountry=CN; 1P_JAR=2022-08-15-03; NID=511=XFb4bC4eqQV5uMXvZ6cHXfcbTiQSDxy5FTis3E8xO4btfQKfqVb_hXx_PI-F7hocx0GGan_w5fCAGyC5VxY4c9Sy9JRGMqT1rNik8N7xAHuTLkXvYi1ezMjfA8dxH75DGMf9MavZd1fjUVmOrWgAGUvbhN_TOuVNygYW7li7JDDSZG5McrdJrEq1VYktOvWbc8p72JG5J7k8Zy75cNM62PfQFE9JZW5OyOsdOx363ZyngjmN4asKLH-2P2h--Q; DV=k_Zvn_luJPFYACJ-bZgLX55dfjT4KZhSuArK4jRoAAMAAKDFqKjTvhxqFwEAAAgH7s-UDNE6ZAAAALHLR6h06tYjHAAAAA; SIDCC=AEf-XMQSdTdkK05CU0x3a4Kff7O1q1bBtDVnnerDebQZQ0BAPs1YSflquUtZM0xwlawY0H-2i8o; __Secure-1PSIDCC=AEf-XMRtuDhEc1B4U1fJhpBou53t6V9fe1cooZypUH2UaAJxdhc6nxY1O3W2NV5Gn1URWId60jQ; __Secure-3PSIDCC=AEf-XMRR0AU9vt_G-cilKqcqUJS4XVV3Hj-70YItW6a8j6km_ZFPJ0MALWacjg9n0AZ19bJsKw'
const process = require('child_process');

// const dirPath = path.join(__dirname, "files");
const proxy = 'http://127.0.0.1:8118'
const agent = new proxyAgent(proxy)
const ffmpeg = createFFmpeg({ log: true });
let videoName = ''

Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function downloadFile(uri,filename){
    videoName = filename.videoName
    var stream = fs.createWriteStream(path.join('files', filename));
    return new Promise((resolve, reject) => {
        request({
            url: uri,
            proxy: proxy
        }).pipe(stream).on('close', () => {
            resolve()
        })
    })
}

async function download1080VideoFile(newVideo) {
    const videoId = newVideo.videoUrl.split('=')[1]
    const info = await ytdl.getInfo(videoId, { // 通过Id获取视频信息
        requestOptions: {
            agent
        }
    });

    const VideoFormat = await ytdl.chooseFormat(info.formats, {
        quality: 'highestvideo', // 获取最高质量视频地址
        requestOptions: {
            agent
        }
    })

    let audioFormats = await ytdl.filterFormats(info.formats, 'audioonly');

    return new Promise((resolve, reject) => {
        const moddleAudio = Math.floor(audioFormats.length / 2)
        console.log(moddleAudio, 'moddleAudio')
        Promise.all([downloadFile(VideoFormat.url, `newVideo${new Date().Format("yyyy-MM-dd")}.mp4`), downloadFile(audioFormats[moddleAudio].url,`newAudio${new Date().Format("yyyy-MM-dd")}.mp3`)]).then(async () => {
            console.log('文件下载完毕')
            // 文件下载完毕
            process.exec('node --experimental-wasm-threads utils/syntheticVideo.js',function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                resolve({
                    ...newVideo,
                    videoPath: path.join(__dirname, `../files/【老高与小沫】${new Date().Format("yyyy-MM-dd")}-1080.mp4`)
                })
            })
        })
    })
}

async function download360VideoFile(newVideo) {
    const videoId = newVideo.videoUrl.split('=')[1]
    const info = await ytdl.getInfo(videoId, { // 通过Id获取视频信息
        requestOptions: {
            agent
        }
    });

    const VideoFormat = await ytdl.chooseFormat(info.formats, {
        // quality: 'highestvideo', // 获取最高质量视频地址
        requestOptions: {
            agent
        }
    })

    return new Promise((resolve, reject) => {
        downloadFile(VideoFormat.url, `【老高与小沫】${new Date().Format("yyyy-MM-dd")}.mp4`).then(() => {
            console.log(`${newVideo.videoName}文件下载完毕`)
            resolve({
                ...newVideo,
                videoPath: path.join(__dirname, `../files/【老高与小沫】${new Date().Format("yyyy-MM-dd")}.mp4`)
            })
        })
    })
}

async function uploadVideoCover(newVideo) {
    return new Promise((resolve, reject) => {
        downloadFile(newVideo.videoCover, `【老高与小沫】${new Date().Format("yyyy-MM-dd")}.jpg`).then(() => {
            console.log(`${newVideo.videoName}封面下载完毕`)
            resolve({
                ...newVideo,
                videoCoverPath: path.join(__dirname, `../files/【老高与小沫】${new Date().Format("yyyy-MM-dd")}.jpg`)
            })
        })
    })
}

exports.download1080VideoFile = download1080VideoFile
exports.download360VideoFile = download360VideoFile
exports.uploadVideoCover = uploadVideoCover

