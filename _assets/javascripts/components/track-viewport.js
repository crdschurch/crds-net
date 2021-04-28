(function() {
  var initTrackable = function(idx, el) {
    var options = resolveOptions(el);
    var viewableAt = null;
    var tracked = false;

    var checkPosition = function() {
      if (tracked) return;
      var rect = el.getBoundingClientRect();
      if (
        rect.top <= $(window).height() &&
        rect.left <= $(window).width() &&
        rect.bottom >= 0 &&
        rect.right >= 0
      ) {
        beginCount();
      } else {
        stopCount();
      }
    }

    var beginCount = function() {
      if (!viewableAt) viewableAt = new Date;
      setTimeout(count, options.duration + 100);
    }

    var stopCount = function() {
      if (viewableAt) return viewableAt = null;
    }

    var count = function() {
      if (!viewableAt) return;
      var viewableFor = new Date - viewableAt;
      if (viewableFor >= options.duration) track();
    }

    var track = function() {
      if (tracked) return;
      if (typeof analytics !== 'undefined') {
        analytics.track(options.event, {
          URL: window.location.href
        });
      }
      tracked = true;
    }

    $(window).on('DOMContentLoaded load resize scroll', checkPosition);
  }

  var resolveOptions = function(el) {
    var options = $(el).data('track-viewport');
    return {
      duration: options['duration'] || 5000,
      event: options['event'] || 'TrackViewport'
    }
  }

  $(document).ready(function() {
    $('[data-track-viewport]').each(initTrackable)
  });
})();
