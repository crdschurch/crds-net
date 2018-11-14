// if live-stream loads first
document.addEventListener("deferred-js-ready", liveInit);

// if app-deferred loads first
if (window.deferredJSReady) {
  liveInit();
}

function liveInit() {
  // Live stream reminder
  $(document).ready(function () {
    var el = document.querySelector('livestream-reminder');

    el.addEventListener('success', function (event) {
        new CRDS.DataTracker().handleTrack('LiveStreamReminderRequested', {
            Source: 'Crossroads.net',
            UpcomingStream: event.detail.day + ' ' + event.detail.time,
            ReminderMethod: event.detail.type,
            Phone: event.detail.phone,
            Email: event.detail.email
        });
    });
  });

  //Trailer Modal
  $(document).ready(function () {
    $('div.modal-video').on('show.bs.modal', function (event) {
      var origSrc = document.getElementById('modal-video-src').dataset.src;
      var regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      var match = origSrc.match(regExp);
      if (match[1] !== undefined) {
        var ytId = match[1];
        $('#modal-video-src').attr('src', 'https://www.youtube.com/embed/' + ytId);
      }
    });
    $('div.modal-video').on('hidden.bs.modal', function (event) {
      $('#modal-video-src').attr('src', '');
    });
  });
  $(document).ready(function () {
    new CRDS.Countdown();
    new CRDS.CardCarousels();
    new CRDS.DataTracker();
  });
}
