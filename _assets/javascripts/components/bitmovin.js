class BitmovinManager {

  constructor(bitmovinConfig) {
      this.isCard = bitmovinConfig.isCard;
      this.container = document.getElementById(`${bitmovinConfig.id}`);
      this.playerConfig = {
          key: '224f523d-e1ba-4f96-ad4d-96365f461c93',
          playback: {
              autoplay: this.getAutoPlay(),
              muted: this.getIsMuted()
          },
          analytics: {
              key: '01e90136-7623-4df4-b0d9-a3d975b00258',
              title: bitmovinConfig.title
          }
      };

      if (this.getHideUI()) {
          this.playerConfig = { ...this.playerConfig, ui: false };
      }

      this.source = {
          title: bitmovinConfig.title,
          //  description: desc,
          hls: bitmovinConfig.url,
          options: {
              startTime: this.getStartTime()
          },
          poster: `https:${bitmovinConfig.image}`,
      };

      this.manuallyTurnedOnCC = false;
      if(!this.isCard) this.createPlayer();
  }

  createPlayer() {
      this.bitmovinPlayer = new bitmovin.player.Player(this.container, this.playerConfig);
      // this.bitmovinPlayer.on('play', this.onPlayerStart());
      // this.bitmovinPlayer.on('playbackfinished', this.onPlayerEnd('Ended'));
      // this.bitmovinPlayer.on('paused', this.onPlayerEnd('Paused'));
      return this.bitmovinPlayer.load(this.source);
  }

  getHideUI() {
      return this.isCard;
  }

  getAutoPlay() {
      if (this.getStartTime() > 0)
          return true;
      let urlParams = new URLSearchParams(window.location.search);
      let autoPlay = urlParams.has('autoPlay') ? Boolean(urlParams.get('autoPlay')) : false;
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
      let urlParams = new URLSearchParams(window.location.search);
      let min = urlParams.has('min') ? parseInt(urlParams.get('min')) : 0;
      let sec = urlParams.has('sec') ? parseInt(urlParams.get('sec')) : 0;
      if (min || sec) {
          startTime = min * 60 + sec;
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
      else
          this.bitmovinPlayer.play();
  }


}
