const { download1080VideoFile, download360VideoFile, uploadVideoCover } = require('./utils/download.js')

const videoObj = {
    videoName: '老高',
    videoUrl: 'https://www.youtube.com/watch?v=_Ms_A0vdrBE',
    videoCover: ''
}

;(async () => {
    await download360VideoFile(videoObj)
    // await download1080VideoFile(videoObj)
})();
