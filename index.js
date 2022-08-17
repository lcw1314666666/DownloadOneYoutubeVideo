const { download1080VideoFile, download360VideoFile, uploadVideoCover } = require('./utils/download.js')

const videoObj = {
    videoName: '平川电竞',
    videoUrl: 'https://www.youtube.com/watch?v=15v2mq2PmBQ',
    videoCover: ''
}

;(() => {
    download1080VideoFile(videoObj)
})();
