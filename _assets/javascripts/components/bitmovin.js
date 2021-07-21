/* global CRDS */
/* global moment */
class BitmovinManager {
  constructor(bitmovinConfig) {
    this.isCard = bitmovinConfig.isCard == 'true';
    this.isStream = bitmovinConfig.isStream == 'true';
    this.subtitles_url = bitmovinConfig.subtitles_url;
    this.spn_subtitles_url = bitmovinConfig.spn_subtitles_url;
    this.autoplay = bitmovinConfig.autoplay == 'true';
    this.videoDuration = Number(bitmovinConfig.duration) * 1000;
    this.timezoneStr = "America/New_York";
    this.dateStringFormat = "YYYY/MM/DD HH:mm:ss";
    this.timeouts = [];
    this.container = document.getElementById(`${bitmovinConfig.id}`);
    this.timestamps = bitmovinConfig.timestamps;
    if (bitmovinConfig.countdown !== false && CRDS.Countdown) {
      this.countdown = new CRDS.Countdown();
    }

    this.playerConfig = {
      key: `${window.CRDS.env.bitmovinPlayerLicense}`,
      playback: {
        autoplay: this.getAutoPlay(),
        muted: this.getIsMuted(),
        preferredTech: [
          {
            player: 'html5',
            streaming: 'hls'
          }
        ]
      },
      analytics: {
        key: `${window.CRDS.env.bitmovinAnalyticsLicense}`,
        title: bitmovinConfig.title
      },
      ui: {
        playbackSpeedSelectionEnabled: true
      },
      cast: {
        enable: true
      },
      remotecontrol: {
        type: "googlecast",
        customReceiverConfig: {
          receiverStylesheetUrl: "https://d1gb5n5uoite2y.cloudfront.net/bitmovin-cast-v1.0.css"
        }
      },
      events: {
        onPlaybackFinished: () => {
          this.showStandbyMessaging();
        }
      },
      network: {
        preprocessHttpRequest: (type, request) => {
          if(request.url.indexOf(".vtt") > -1) return Promise.resolve(request);
          let sessionId;
          let noSound = ["/media/", "/media", "/"]; // list of pages where sound will never be enabled [Analytics]
          var cookie = "; " + document.cookie;
          var parts = cookie.split("; bitmovin_analytics_uuid=");
          if (parts.length == 2)
             sessionId = parts
              .pop()
              .split(";")
              .shift();
          const hasSound = !this.isCard;
          request.url = `${request.url}?source=web&product=crds-net&hasSound=${hasSound}&session=${sessionId}`;
          return Promise.resolve(request);
        }
      },
    };

    if (!!this.timestamps && this.timestamps.length >0) {
      this.playerConfig.ui.metadata = { 
        markers: this.timestamps.map(time => {
          return {
            cssClasses: ['bitmovin-seekbar-playbackposition', 'bitmovin-seekbar-backdrop', 'bitmovin-seekbar-playbackposition-marker'],
            time: ((time.minutes || 0) * 60) + (time.seconds || 0),
            title: time.description
          }
        })
      };
    }

    if (this.getHidePlaybackSpeed()) {
      this.playerConfig.ui.playbackSpeedSelectionEnabled = false;
    }

    if (this.isStream) {
      if (this.countdown.events) this.streamInit(this.countdown.events, bitmovinConfig);
      this.countdown.streamStatusPromise.then(events => {
        this.streamInit(events, bitmovinConfig);
      });
    } else {
      this.createSource(bitmovinConfig);
      if (!this.isCard) this.createPlayer();
    }
  }

  createSource(bitmovinConfig) {
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
  }

  createPlayer() {
    this.bitmovinPlayer = new bitmovin.player.Player(this.container, this.playerConfig);
    this.bitmovinPlayer.on("play", () => {
      this.onPlayerStart();
    });
    this.bitmovinPlayer.on("playbackfinished", () => {
      this.onPlayerEnd("Ended");
      this.revealPostVideoMessage();
    });
    this.bitmovinPlayer.on("paused", eventProps => {
      if (eventProps.issuer !== "ui") return;
      this.onPlayerEnd("Paused");
      if (this.isStream) this.cancelStreams();
    });

    this.bitmovinPlayer.on("subtitleenable", subtitle => {
      this.onSubtitlesEnabled(subtitle);
    });
    this.bitmovinPlayer.on("subtitledisable", () => {
      this.onSubtitleDisabled();
    });
    this.bitmovinPlayer.on("sourceloaded", () => {
      this.addExternalSubtitles();
    });
    this.bitmovinPlayer.on("ready", () => {
      this.onPlayerReady(new Date());
    });

    return this.bitmovinPlayer.load(this.source);
  }

  scheduleFutureEvents() {
    this.events.forEach(e => {
      const now = moment();
      const timeTilEventStart = moment.tz(e.start, this.dateStringFormat, this.timezoneStr) - now;
      const videoEndTime =
        moment.tz(e.start, this.dateStringFormat, this.timezoneStr) + this.videoDuration;
      const timeTilVideoEnd = videoEndTime - now;
      if (moment.tz(e.start, this.dateStringFormat, this.timezoneStr) > now) {
        let eventStartTimeout = setTimeout(() => {
          this.restartVideo();
        }, timeTilEventStart);
        this.timeouts.push(eventStartTimeout);
      }

      let videoEndTimeout = setTimeout(() => {
        this.showStandbyMessaging();
      }, timeTilVideoEnd);
      this.timeouts.push(videoEndTimeout);
    });
  }

  cancelStreams() {
    for (var i in this.timeouts) {
      clearTimeout(this.timeouts[i]);
    }
  }

  getHidePlaybackSpeed() {
    return this.isStream;
  }

  getAutoPlay() {
    if (this.isStream || this.autoplay || (this.getStartTime() > 0 && !this.currentHasEnded())) return true;
    let urlParams = new URLSearchParams(window.location.search);
    let autoplayString = urlParams.has("autoPlay") ? urlParams.get("autoPlay") : "false";
    let autoPlay = autoplayString == "true" ? true : false;
    return autoPlay;
  }

  getIsMuted() {
    if (this.isCard) return true;
    if (!this.getAutoPlay() || this.autoplay) return false;

    let urlParams = new URLSearchParams(window.location.search);
    let sound = urlParams.has("sound") ? parseInt(urlParams.get("sound")) : 0;
    if (sound == 11) return false;
    return true;
  }

  revealPostVideoMessage() {
    const messageEl = document.getElementById("post-video-message");
    messageEl.style.opacity = 1;
    messageEl.style.zIndex = 2;
  }

  getStartTime() {
    let startTime = 0;
    if (this.isStream && this.countdown.currentEvent) {
      startTime = this.calculateStreamElapsed();
    } else {
      let urlParams = new URLSearchParams(window.location.search);
      let min = urlParams.has("min") ? parseInt(urlParams.get("min")) : 0;
      let sec = urlParams.has("sec") ? parseInt(urlParams.get("sec")) : 0;
      if (min || sec) {
        startTime = min * 60 + sec;
      }
    }
    return startTime;
  }

  onPlayerStart() {
    if (!this.isCard) {
      const mediaMetricView = new Event('mediaMetricInteractionView');
      document.dispatchEvent(mediaMetricView);
    }

    if (this.getIsMuted()) this.enableSubtitles();
    if (typeof analytics !== "undefined") {
      if (this.getAutoPlay)
        analytics.track("VideoStarted", {
          Title: this.bitmovinPlayer.getSource().title,
          VideoId: this.bitmovinPlayer.getSource().hls,
          Source: "CrossroadsNet",
          VideoTotalDuration: this.bitmovinPlayer.getDuration()
        });
    }
  }

  onSubtitlesEnabled(subtitle) {
    if (subtitle.subtitle.lang == "spn") document.cookie = "spn_subs=true;domain=.crossroads.net;path=/";
    else document.cookie = "spn_subs=;domain=.crossroads.net;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC";

    if (this.container.offsetWidth <= 300) {
      this.container.querySelector(".bmpui-ui-subtitle-overlay").style.fontSize = "0.7em";
    } else if (this.container.offsetWidth <= 600) {
      this.container.querySelector(".bmpui-ui-subtitle-overlay").style.fontSize = "0.9em";
    }
  }

  onSubtitleDisabled() {
    document.cookie = "spn_subs=;domain=.crossroads.net;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC";
  }

  onPlayerEnd(reason) {
    if (typeof analytics !== "undefined") {
      analytics.track("VideoEnded", {
        Title: this.bitmovinPlayer.getSource().title,
        VideoId: this.bitmovinPlayer.getSource().hls,
        Source: "CrossroadsNet",
        VideoTotalDuration: this.bitmovinPlayer.getDuration(),
        CurrentTime: this.bitmovinPlayer.getCurrentTime(),
        ReasonForEnding: reason
      });
    }
  }

  getQualityLabels(data) {
    let resolution = "";
    let kbps = Math.round(data.bitrate / 1000);

    // convert to megabits if applicable
    let bitrate = kbps > 1000 ? `${(kbps / 1000).toFixed(1)} mbps` : `${kbps} kbps`;

    if (data.height < 240) resolution = "144p";
    else if (data.height < 360) resolution = "240p";
    else if (data.height < 480) resolution = "360p";
    else if (data.height < 720) resolution = "480p";
    else if (data.height < 1080) resolution = "HD 720p";
    else if (data.height < 1440) resolution = "HD 1080p";
    else if (data.height < 2160) resolution = "HD 1440p";
    else resolution = "4k 2160p";

    let label = `${resolution} (${bitrate})`;
    return label;
  }

  showStandbyMessaging() {
    this.pauseVideo();
    this.standbyElm.style.opacity = 1;
    this.standbyElm.style.zIndex = 10;
  }

  hideStandbyMessaging() {
    this.standbyElm.style.opacity = 0;
    this.standbyElm.style.zIndex = 0;
  }

  calculateStreamElapsed() {
    this.currentStreamStart = moment.tz(
      this.countdown.currentEvent.start,
      this.dateStringFormat,
      this.timezoneStr
    );
    this.now = moment();
    this.timeElapsed = (this.now - this.currentStreamStart) / 1000;
    return this.timeElapsed;
  }

  restartVideo() {
    this.hideStandbyMessaging();
    this.seekTo(0, 0);
  }

  enableSubtitles() {
    let i = 0;
    var interval = setInterval(() => {
      const subtitles = this.bitmovinPlayer.subtitles.list();
      if (subtitles.length) {
        if (this.getCookie("spn_subs") == "true" && this.spn_subtitles_url)
          this.bitmovinPlayer.subtitles.enable("external_spn");
        else this.bitmovinPlayer.subtitles.enable("external");
        clearInterval(interval);
      }
      if (i >= 3) clearInterval(interval);
      i += 1;
    }, 1000);
  }

  addExternalSubtitles() {
    if (this.subtitles_url) {
      this.bitmovinPlayer.subtitles.add({
        id: "external",
        lang: "en",
        label: "English",
        url: this.subtitles_url,
        kind: "subtitle"
      });
    }
    if (this.spn_subtitles_url) {
      this.bitmovinPlayer.subtitles.add({
        id: "external_spn",
        lang: "spn",
        label: "Spanish",
        url: this.spn_subtitles_url,
        kind: "subtitle"
      });
    }
  }

  onCCEnabled() {
    this.manuallyTurnedOnCC = true;
  }

  seekTo(min, sec) {
    min = min || 0;
    sec = sec || 0;
    this.bitmovinPlayer.seek(min * 60 + sec, true);
    this.playVideo();
    history.pushState({}, document.title, "?min=" + min + "&sec=" + sec);
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

  onPlayerReady(readyTime) {
    this.setQualityOptions();
    analytics.track("VideoReady", {
      Title: this.bitmovinPlayer.getSource().title,
      VideoId: this.bitmovinPlayer.getSource().hls,
      Source: "CrossroadsNet",
      VideoTimeToReady: readyTime.getTime() - window.performance.timing.domContentLoadedEventEnd
    });
  }

  setQualityOptions() {
    const qualities = this.bitmovinPlayer.getAvailableVideoQualities();
    const dedupedQualities = qualities.reduce((unique, item) => {
      if (unique.find(u => u.label.split("(").shift() == item.label.split("(").shift())) {
        this.removeQualityByIndex(item.id);
        return unique;
      } else return [...unique, item];
    }, []);
    if (this.isCard) {
      const quality = dedupedQualities.find(quality => quality.label.includes("720"));
      this.bitmovinPlayer.setVideoQuality(quality.id);
    }
  }

  streamInit(events, bitmovinConfig) {
    this.createSource(bitmovinConfig);
    this.createPlayer();
    this.bitmovinPlayer.on("sourceloaded", () => {
      this.videoDuration = this.bitmovinPlayer.getDuration() * 1000;
      this.events = events.data.broadcasts;
      this.scheduleFutureEvents();
      this.standbyElm = document.getElementById("standby-message");
      this.manuallyTurnedOnCC = false;
    });
  }

  removeQualityByIndex(id) {
    const selector = "bmpui-ui-selectbox bmpui-ui-videoqualityselectbox";

    function waitForElementToDisplay() {
      const elem = document.getElementsByClassName(selector);
      if (elem.length) {
        for (var i = 0; i < elem[0].length; i++) {
          if (elem[0].options[i].value == id) {
            elem[0].options[i].remove();
          }
        }
        return;
      } else {
        setTimeout(function() {
          waitForElementToDisplay(selector, 100);
        }, 100);
      }
    }
    waitForElementToDisplay();
  }

  getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
      return parts
        .pop()
        .split(";")
        .shift();
  }
}

var defBitmovinLoaded = new Event("deferred-bitmovin-ready");
document.dispatchEvent(defBitmovinLoaded);
window.defBitmovinLoaded = true;
