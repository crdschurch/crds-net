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
      cast: {
        enable: true
      },
      remotecontrol: {
        type: "googlecast",
        customReceiverConfig: {
          receiverStylesheetUrl: "https://d1gb5n5uoite2y.cloudfront.net/bitmovin-cast-v1.0.css"
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
    this.subtitles_url = bitmovinConfig.subtitles_url;
    this.spn_subtitles_url = bitmovinConfig.spn_subtitles_url;
    this.source = {
      title: bitmovinConfig.title,
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

    this.manuallyTurnedOnCC = false;
    if (!this.isCard) this.createPlayer();
  }

  createPlayer() {
    this.bitmovinPlayer = new bitmovin.player.Player(this.container, this.playerConfig);
    this.bitmovinPlayer.on("play", () => {
      this.onPlayerStart();
    });
    this.bitmovinPlayer.on("playbackfinished", () => {
      this.onPlayerEnd("Ended");
    });
    this.bitmovinPlayer.on("playbackfinished", () => {
      this.revealPostVideoMessage();
    });
    this.bitmovinPlayer.on("paused", () => {
      this.onPlayerEnd("Paused");
    });
    this.bitmovinPlayer.on("ready", () => {
      this.setQualityOptions();
    });
    this.bitmovinPlayer.on("sourceloaded", () => this.addExternalSubtitles());
    this.bitmovinPlayer.on("subtitleenable", subtitle => {
      this.onSubtitlesEnabled(subtitle);
    });
    this.bitmovinPlayer.on("subtitledisable", () => {
      this.onSubtitleDisabled();
    });
    return this.bitmovinPlayer.load(this.source);
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

  getAutoPlay() {
    if (this.getStartTime() > 0) return true;
    let urlParams = new URLSearchParams(window.location.search);
    let autoplayString = urlParams.has("autoPlay") ? urlParams.get("autoPlay") : "false";
    let autoPlay = autoplayString == "true" ? true : false;
    return autoPlay;
  }

  getIsMuted() {
    if (this.isCard) return true;
    if (!this.getAutoPlay()) return false;
    let urlParams = new URLSearchParams(window.location.search);
    let sound = urlParams.has("sound") ? parseInt(urlParams.get("sound")) : 0;
    if (sound == 11) return false;
    return true;
  }

  getStartTime() {
    let startTime = 0;
    let urlParams = new URLSearchParams(window.location.search);
    let min = urlParams.has("min") ? parseInt(urlParams.get("min")) : 0;
    let sec = urlParams.has("sec") ? parseInt(urlParams.get("sec")) : 0;
    if (min || sec) {
      startTime = min * 60 + sec;
    }
    return startTime;
  }

  revealPostVideoMessage() {
    const messageEl = document.getElementById("post-video-message");
    messageEl.style.opacity = 1;
    messageEl.style.zIndex = 2;
  }

  onPlayerStart() {
    if (this.getIsMuted()) {
      this.enableSubtitles();
    }
    if (typeof analytics !== "undefined" && this.bitmovinPlayer.getSource()) {
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
    if (this.subtitles_url) 
    this.bitmovinPlayer.subtitles.add({
      id: "external",
      lang: "en",
      label: "English",
      url: this.subtitles_url,
      kind: "subtitle"
    });
    if (this.spn_subtitles_url)
    this.bitmovinPlayer.subtitles.add({
      id: "external_spn",
      lang: "spn",
      label: "Spanish",
      url: this.spn_subtitles_url,
      kind: "subtitle"
    });




  }

  onPlayerEnd(reason) {
    if (typeof analytics !== "undefined" && this.bitmovinPlayer.getSource()) {
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

  getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
      return parts
        .pop()
        .split(";")
        .shift();
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
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};
