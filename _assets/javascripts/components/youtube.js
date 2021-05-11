window.CRDS = window.CRDS || {};

class YoutubeManager {
  constructor() {
    this.player = null;
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.seekTo = this.seekTo.bind(this);
    this.videoStopped = this.videoStopped.bind(this);

    let videoElement = document.querySelector('#js-media-video');
    if (videoElement) {
      this.createPlayer(videoElement.getAttribute('player-id'), videoElement.getAttribute('video-id'));
    }
  }

  createPlayer(divId, videoId) {
    // This function creates an <iframe> (and YouTube player)
    // after the API code downloads.
    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player(divId, {
        height: '315',
        width: '560',
        videoId: videoId,
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });
    };

    setTimeout(() => {
      // This code loads the IFrame Player API code asynchronously.
      let tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }, 100);
  }

  onPlayerReady() {
    let urlParams = new URLSearchParams(window.location.search);
    let min = urlParams.has('min') ? parseInt(urlParams.get('min')) : 0;
    let sec = urlParams.has('sec') ? parseInt(urlParams.get('sec')) : 0;
    let autoplay = urlParams.has('autoPlay');

    if (min || sec || autoplay) {
      this.player.playVideo();
      this.player.seekTo(min * 60 + sec, true);
    }
  };

  onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED) {
      if (typeof analytics !== 'undefined') {
        analytics.track('VideoEnded', {
          Title: this.player.getVideoData().title,
          VideoId: this.player.getVideoData().video_id,
          Source: 'CrossroadsNet',
          VideoTotalDuration: this.player.getDuration(),
          CurrentTime: this.player.getCurrentTime(),
          ReasonForEnding: this.videoStopped(event)
        });
      }
    } else {
      if (typeof analytics !== 'undefined') {
        analytics.track('VideoStarted', {
          Title: this.player.getVideoData().title,
          VideoId: this.player.getVideoData().video_id,
          Source: 'CrossroadsNet',
          VideoTotalDuration: this.player.getDuration()
        });
      }
    }

    if (event.data == YT.PlayerState.PLAYING) {
      const mediaMetricView = new Event('mediaMetricInteractionView');
      document.dispatchEvent(mediaMetricView);
    }
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  seekTo(min, sec) {
    min = min || 0;
    sec = sec || 0;
    this.player.seekTo(min * 60 + sec, true);
    this.player.playVideo();
    history.pushState({}, document.title, '?min=' + min + '&sec=' + sec);
  }

  videoStopped(event) {
    let reasonForEnding;
    if (event.data == YT.PlayerState.ENDED) {
      reasonForEnding = 'Ended';
    } else if (event.data == YT.PlayerState.PAUSED) {
      reasonForEnding = 'Paused';
    } else {
      reasonForEnding = null;
    }
    return reasonForEnding;
  }
}


if (!CRDS.VideoManager)
  CRDS.VideoManager = new YoutubeManager();
