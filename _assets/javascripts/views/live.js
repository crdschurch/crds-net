// if live-stream loads first
document.addEventListener("deferred-js-ready", liveInit);

// if app-deferred loads first
if (window.deferredJSReady) {
  liveInit();
}

function liveInit(){
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

  //Smooth scroller
  $(document).ready(function(event) {
    $('[data-smooth-scroll-to]').click(function(event) {
      event.preventDefault();    
      var targetId = $(this).data('smooth-scroll-to');
      var target = document.getElementById(targetId)
      if (target) {
        var scrollTo = $(target).offset().top;
        var offset = parseInt($(this).data('smooth-scroll-offset'));
        if (!isNaN(offset) && offset > 0) { scrollTo -= offset; }
        $('html, body').animate({ scrollTop: scrollTo }, scrollTo / 2);
      }
      return true;
    });
  });

  //Trailer Modal
  $(document).ready(function () {
    $('div.modal-video').on('show.bs.modal', function (event) {
      var origSrc = document.getElementById('modal-video-src').dataset.src;
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = origSrc.match(regExp);
      var ytId = (match && (match[7].length == 11 || match[7].length == 12)) ? match[7] : false;
      $('#modal-video-src').attr('src', 'https://www.youtube.com/embed/' + ytId);
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