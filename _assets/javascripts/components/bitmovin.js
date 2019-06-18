/* global CRDS */
/* global moment */
class BitmovinManager {
    constructor(bitmovinConfig) {
        this.isCard = bitmovinConfig.isCard;
        this.isStream = bitmovinConfig.isStream;
        this.videoDuration = Number(bitmovinConfig.duration) * 1000;
        this.timezoneStr = 'America/New_York';
        moment.tz.setDefault(this.timezoneStr);
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
                this.createPlayer();
                this.bitmovinPlayer.on('sourceloaded', () => {
                    this.videoDuration = this.bitmovinPlayer.getDuration() * 1000;
                    this.events = events.data.broadcasts;
                    this.scheduleFutureEvents();
                    this.standbyElm = document.getElementById('standby-message');
                    this.manuallyTurnedOnCC = false;
                });
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
        this.bitmovinPlayer = new bitmovin.player.Player(
            this.container,
            this.playerConfig
        );
        this.bitmovinPlayer.on('play', () => { this.onPlayerStart() });
        this.bitmovinPlayer.on('playbackfinished', () => { this.onPlayerEnd('Ended') });
        this.bitmovinPlayer.on('paused', () => { this.onPlayerEnd('Paused') });
        this.bitmovinPlayer.on('subtitleenable', () => { this.onSubtitlesEnabled(); })
        // this.bitmovinPlayer.on('playbackfinished', this.showStandbyMessaging());
        // this.bitmovinPlayer.on('play', this.hideStandbyMessaging());
        return this.bitmovinPlayer.load(this.source);
    }

    scheduleFutureEvents() {
        this.events
            .forEach(e => {
                const now = moment();
                const timeTilEventStart = moment(e.start) - now;
                const videoEndTime = moment(e.start) + this.videoDuration;
                const timeTilVideoEnd = videoEndTime - now;
                if (moment(e.start) > now) {
                    setTimeout(() => {
                        this.restartVideo();
                    }, timeTilEventStart);
                }

                setTimeout(() => {
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
        if(this.isCard) return true;
        if(!this.getAutoPlay()) return false;

        let urlParams = new URLSearchParams(window.location.search);
        let sound = urlParams.has('sound') ? parseInt(urlParams.get('sound')) : 0;
        if (sound == 11) return false;
        return true;
    }

    getStartTime() {
        let startTime = 0;
        if (this.isStream && this.countdown.currentEvent) {
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

    onSubtitlesEnabled() {
        if (this.container.offsetWidth <= 300) {
            this.container.querySelector(".bmpui-ui-subtitle-overlay").style.fontSize = '0.7em';
        }
        else if (this.container.offsetWidth <= 600) {
            this.container.querySelector(".bmpui-ui-subtitle-overlay").style.fontSize = '0.9em';
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
        this.currentStreamStart = moment(this.countdown.currentEvent.start);
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
                this.bitmovinPlayer.subtitles.enable(subtitles[0].id);
                clearInterval(interval);
            }
            if (i >= 3) clearInterval(interval);
            i += 1;
        }, 1000)
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
