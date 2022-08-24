function getVideoId(videoUrl) {
    let videoId = videoUrl.substr(videoUrl.indexOf("=") + 1)
    if(videoId.indexOf('&') > -1) {
        videoId = videoId.split('&')[0]
    }
    return videoId
}

exports.getVideoId = getVideoId
