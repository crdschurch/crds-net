/* global CRDS */
/* global moment */
class BitmovinManager {
    constructor(bitmovinConfig) {
        this.isCard = bitmovinConfig.isCard;
        this.isStream = bitmovinConfig.isStream;
        this.videoDuration = Number(bitmovinConfig.duration) * 1000;
        this.timezoneStr = 'America/New_York';
        this.container = document.getElementById(`${bitmovinConfig.id}`);
        this.countdown = new CRDS.Countdown();
        this.playerConfig = {
            key: '224f523d-e1ba-4f96-ad4d-96365f461c93',
            playback: {
                autoplay: this.getAutoPlay(),
                muted: this.getIsMuted()
            },
            analytics: {
                key: '01e90136-7623-4df4-b0d9-a3d975b00258',
                title: bitmovinConfig.title
            },
            ui: {
                playbackSpeedSelectionEnabled: true
            },
            events: {
                onPlaybackFinished: () => {
                    this.showStandbyMessaging();
                }
            }
        };

        if (this.getHidePlaybackSpeed()) {
            this.playerConfig.ui.playbackSpeedSelectionEnabled = false;
        }

        if (this.isStream) {
            this.countdown.streamStatusPromise.then(events => {
                this.createSource(bitmovinConfig);
                this.events = events.data.broadcasts;
                this.scheduleFutureEvents();
                this.standbyElm = document.getElementById('standby-message');
                this.manuallyTurnedOnCC = false;
                if (!this.isCard) this.createPlayer();
            });
        } else {
            this.createSource(bitmovinConfig);
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
        this.bitmovinPlayer = new bitmovin.player.Player(
            this.container,
            this.playerConfig
        );
        this.bitmovinPlayer.on('play', () => { this.onPlayerStart() });
        this.bitmovinPlayer.on('playbackfinished', () => { this.onPlayerEnd('Ended') });
        this.bitmovinPlayer.on('paused', () => { this.onPlayerEnd('Paused') });
        // this.bitmovinPlayer.on('playbackfinished', this.showStandbyMessaging());
        // this.bitmovinPlayer.on('play', this.hideStandbyMessaging());
        return this.bitmovinPlayer.load(this.source);
    }

    scheduleFutureEvents() {
        console.log(this.events);
        this.events
            .forEach(e => {
                const now = moment.tz(this.timezoneStr);
                const timeTilEventStart = moment.tz(e.start, this.timezoneStr) - now;
                const videoEndTime = moment.tz(e.start, this.timezoneStr) + this.videoDuration;
                const timeTilVideoEnd = videoEndTime - moment.tz(this.timezoneStr);
                if (moment.tz(e.start, this.timezoneStr) > moment.tz(this.timezoneStr)) {
                    console.log('setting timeout for restart', timeTilEventStart)
                    setTimeout(() => {
                        console.log('restart event fired')
                        this.restartVideo();
                    }, timeTilEventStart);
                }

                console.log('setting timeout for standby', timeTilVideoEnd)
                setTimeout(() => {
                    console.log('standby event fired')
                    this.showStandbyMessaging();
                }, timeTilVideoEnd);
            });
    }

    getHidePlaybackSpeed() {
        return this.isStream;
    }

    getAutoPlay() {
        if (this.isStream || (this.getStartTime() > 0 && !this.currentHasEnded())) return true;
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
        if (this.isStream && this.countdown.currentEvent && !this.currentHasEnded()) {
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

    currentHasEnded() {
        const now = moment.tz(this.timezoneStr);
        return now - this.currentVideoEndTime > 0 ? true : false;
    }

    onPlayerStart() {
        if (this.getIsMuted()) this.enableSubtitles();
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
        let resolution = '';
        let kbps = Math.round(data.bitrate / 1000);

        // convert to megabits if applicable
        let bitrate =
            kbps > 1000 ? `${(kbps / 1000).toFixed(1)} mbps` : `${kbps} kbps`;

        if (data.height <= 240) {
            resolution = '240p';
        } else if (data.height <= 360) {
            resolution = '360p';
        } else if (data.height <= 480) {
            resolution = '480p';
        } else if (data.height <= 720) {
            resolution = 'HD 720p';
        } else if (data.height <= 1080) {
            resolution = 'HD 1080p';
        }

        let label = `${resolution} (${bitrate})`;
        return label;
    }

    showStandbyMessaging() {
        this.bitmovinPlayer.pause();
        this.standbyElm.style.opacity = 1;
        this.standbyElm.style.zIndex = 10;
    }

    hideStandbyMessaging() {
        this.bitmovinPlayer.play();
        this.standbyElm.style.opacity = 0;
        this.standbyElm.style.zIndex = 0;
    }

    calculateStreamElapsed() {
        this.currentStreamStart = moment.tz(this.countdown.currentEvent.start, this.timezoneStr);
        this.now = moment.tz(this.timezoneStr);
        this.timeElapsed = (this.now - this.currentStreamStart) / 1000;
        return this.timeElapsed;
    }

    restartVideo() {
        this.hideStandbyMessaging();
        this.seekTo(0, 0);
    }


    enableSubtitles() {
        const subtitles = this.bitmovinPlayer.subtitles.list();
        if (subtitles.length)
            this.bitmovinPlayer.subtitles.enable(subtitles[0].id);
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
