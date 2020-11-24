class AudioVideoTrigger {

  constructor() {
    this.initEls();
    this.initVisibility();
    this.listen();
  }

  initEls() {
    this.playerContainer = $('[data-audio-video-control]').first();
    this.audioTrigger = $('[data-audio-trigger]').first();
    this.audioPlayer = $('[data-audio-player]').first();
    if (this.audioPlayer.length > 0) this.audioHTML = this.audioPlayer[0].innerHTML;
    this.videoTrigger = $('[data-video-trigger]').first();
    this.videoPlayer = $('[data-video-player]').first();
  }

  initVisibility() {
    this.audioPlayer.html('');

    this.playerContainer.removeClass('hide');
    if (this.videoPlayer.length > 0) {
      this.audioPlayer.addClass('hide');
      this.audioTrigger.removeClass('hide');
      this.videoTrigger.addClass('hide');
    } else {
      this.videoPlayer.addClass('hide');
      this.audioTrigger.remove();
    }
  }

  listen() {
    this.audioTrigger.on('click', (event) => this.activateAudio());
    this.videoTrigger.on('click', (event) => this.activateVideo());
  }

  activateAudio() {
    if (typeof onAudioActivate !== 'undefined') onAudioActivate();
    this.audioPlayer.html(this.audioHTML);
    this.videoPlayer.addClass('hide');
    this.audioPlayer.removeClass('hide');

    this.audioTrigger.addClass('hide');
    this.videoTrigger.removeClass('hide');
  }

  activateVideo() {
    if (typeof onVideoActivate !== 'undefined') onVideoActivate();
    this.audioPlayer.html('');
    this.audioPlayer.addClass('hide');
    this.videoPlayer.removeClass('hide');

    this.audioTrigger.removeClass('hide');
    this.videoTrigger.addClass('hide');
  }
}

$(document).ready(function() {
  if ($('[data-audio-video-control]').length > 0) new AudioVideoTrigger;
});
