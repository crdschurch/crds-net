/* global CRDS */
/* global moment */
class BitmovinManager {
  constructor(bitmovinConfig) {
    this.isCard = bitmovinConfig.isCard;
    this.timezoneStr = "America/New_York";
    this.container = document.getElementById(`${bitmovinConfig.id}`);
    this.countdown = new CRDS.Countdown();
    this.playerConfig = {
      key: '224f523d-e1ba-4f96-ad4d-96365f461c93',
      playback: {
        autoplay: this.getAutoPlay(),
        muted: this.getIsMuted(),

      },
      analytics: {
        key: '01e90136-7623-4df4-b0d9-a3d975b00258',
        title: bitmovinConfig.title
      }
    };

    if (this.getHideUI()) {
      this.playerConfig = { ...this.playerConfig, ui: false };
    }

    this.countdown.streamStatusPromise.then(events => {
      this.source = {
        title: bitmovinConfig.title,
        //  description: desc,
        hls: bitmovinConfig.url,
        options: {
          startTime: this.getStartTime()
        },
        poster: `https:${bitmovinConfig.image}`,
        labeling: {
          dash: {
            qualities: this.getQualityLabels
          },
          hls: {
            qualities: this.getQualityLabels
          }
        }
      };

      this.events = events.data.broadcasts;
      this.scheduleFutureEvents();
      this.manuallyTurnedOnCC = false;
      if (!this.isCard) this.createPlayer();
    });
  }

  scheduleFutureEvents() {
    this.events
        .filter((e) => moment.tz(e.start, this.timezoneStr) > moment.tz(this.timezoneStr))
        .forEach((e) => {
            var timeTilEvent = moment.tz(e.start, this.timezoneStr) - moment.tz(this.timezoneStr);
            setTimeout(function() {
                console.log(this.bitmovinPlayer)
                this.restartVideo()
            }, timeTilEvent);
        })
  }

  createPlayer() {
    this.bitmovinPlayer = new bitmovin.player.Player(
      this.container,
      this.playerConfig
    );
    // this.bitmovinPlayer.on('play', this.onPlayerStart());
    // this.bitmovinPlayer.on('playbackfinished', this.onPlayerEnd('Ended'));
    // this.bitmovinPlayer.on('paused', this.onPlayerEnd('Paused'));
    return this.bitmovinPlayer.load(this.source);
  }

  getHideUI() {
    return this.isCard;
  }

  getAutoPlay() {
    if (this.getStartTime() > 0) return true;
    let urlParams = new URLSearchParams(window.location.search);
    let autoPlay = urlParams.has('autoplay')
      ? Boolean(urlParams.get('autoplay'))
      : false;
    return autoPlay;
  }

  getIsMuted() {
    let urlParams = new URLSearchParams(window.location.search);
    let sound = urlParams.has('sound') ? parseInt(urlParams.get('sound')) : 0;
    if (sound == 11) return false;
    return true;
  }

  getStartTime() {
    let startTime = 0;
    if (this.countdown.currentEvent) {
      startTime = this.calculateStreamElapsed();
    } else {
      let urlParams = new URLSearchParams(window.location.search);
      let min = urlParams.has('min') ? parseInt(urlParams.get('min')) : 0;
      let sec = urlParams.has('sec') ? parseInt(urlParams.get('sec')) : 0;
      if (min || sec) {
        startTime = min * 60 + sec;
      }
    }

    return startTime;
  }

  onPlayerStart() {
    if (typeof analytics !== 'undefined') {
      analytics.track('VideoStarted', {
        Title: this.bitmovinPlayer.getSource().title,
        VideoId: this.bitmovinPlayer.getSource().hls,
        Source: 'CrossroadsNet',
        VideoTotalDuration: this.bitmovinPlayer.getDuration()
      });
    }
  }

  onPlayerEnd(reason) {
    if (typeof analytics !== 'undefined') {
      analytics.track('VideoEnded', {
        Title: this.bitmovinPlayer.getSource().title,
        VideoId: this.bitmovinPlayer.getSource().hls,
        Source: 'CrossroadsNet',
        VideoTotalDuration: this.bitmovinPlayer.getDuration(),
        CurrentTime: this.bitmovinPlayer.getCurrentTime(),
        ReasonForEnding: reason
      });
    }
  }

  getQualityLabels(data) {
    let label = '';
    let resolution = '';
    let bitrate = `${(data.bitrate / 1000000).toFixed(2)} mbs`;

    if (data.height <= 240) {
      resolution = '240p SD';
    } else if (data.height <= 480) {
      resolution = '480p SD';
    } else if (data.height <= 720) {
      resolution = '720p HD';
    } else if (data.height <= 1080) {
        resolution = '1080p HD';
    }

    label = `${resolution} - ${bitrate}`;
    return label;
  }

  calculateStreamElapsed() {
    this.currentStreamStart = new Date(this.countdown.currentEvent.start);
    this.now = new Date();
    this.timeElapsed = (this.now - this.currentStreamStart) / 1000;
    return this.timeElapsed;
  }

  restartVideo() {
    this.pauseVideo();
    // this.seekTo(0,0);
  }

  onUnmute() {
    //TODO: if not manuallyTurnedOnCC then turn off subtitles
  }

  onMuted() {
    //TODO: turn on subtitles?
  }

  onCCEnabled() {
    this.manuallyTurnedOnCC = true;
  }

  seekTo(min, sec) {
    min = min || 0;
    sec = sec || 0;
    this.bitmovinPlayer.seek(min * 60 + sec, true);
    this.bitmovinPlayer.play();
    history.pushState({}, document.title, '?min=' + min + '&sec=' + sec);
  }

  pauseVideo() {
    this.bitmovinPlayer.pause();
  }

  playVideo() {
    if (!this.bitmovinPlayer)
      this.createPlayer().then(() => {
        this.bitmovinPlayer.play();
      });
    else this.bitmovinPlayer.play();
  }
}
