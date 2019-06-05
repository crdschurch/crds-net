class BitmovinManager {

    constructor(bitmovinConfig) {
        this.isCard = bitmovinConfig.isCard;
        this.container = document.getElementById(`${bitmovinConfig.id}`);
        this.playerConfig = {
            key: '224f523d-e1ba-4f96-ad4d-96365f461c93',
            playback: {
                autoplay: this.getAutoPlay(),
                muted: this.getIsMuted(),
            },
            analytics: {
                key: '01e90136-7623-4df4-b0d9-a3d975b00258',
                title: bitmovinConfig.title
            },
            remotecontrol: {
                type: 'googlecast'
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
        this.bitmovinPlayer.on('play', () => { this.onPlayerStart() });
        this.bitmovinPlayer.on('playbackfinished', () => { this.onPlayerEnd('Ended') });
        this.bitmovinPlayer.on('paused', () => { this.onPlayerEnd('Paused') });
        return this.bitmovinPlayer.load(this.source);
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
        if (this.getIsMuted()) this.enableSubtitles();

        analytics.track('VideoStarted', {
            Title: this.bitmovinPlayer.getSource().title,
            VideoId: this.bitmovinPlayer.getSource().hls,
            Source: 'CrossroadsNet',
            VideoTotalDuration: this.bitmovinPlayer.getDuration()
        });

    }

    enableSubtitles() {
        const subtitles = this.bitmovinPlayer.subtitles.list();
        if (subtitles.length)
            this.bitmovinPlayer.subtitles.enable(subtitles[0].id);
    }

    onPlayerEnd(reason) {
        if (typeof analytics !== 'undefined' && this.bitmovinPlayer.getSource()) {
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
