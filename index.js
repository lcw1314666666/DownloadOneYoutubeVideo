const { download1080VideoFile, download360VideoFile, uploadVideoCover } = require('./utils/download.js')

const videoObj = {
    videoName: '老高',
    videoUrl: 'https://www.youtube.com/watch?v=BFMqm7zkld8',
    videoCover: ''
}

;(() => {
    download1080VideoFile(videoObj)
})();
