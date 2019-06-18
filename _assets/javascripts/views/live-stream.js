// if live-stream loads first
document.addEventListener("deferred-js-ready", liveStreamInit);

// if app-deferred loads first
if (window.deferredJSReady) {
  liveStreamInit();
}

function liveStreamInit() {
  // IFrame Resizer (for Give section)
  // iFrameResize({
  //   heightCalculationMethod: 'taggedElement',
  //   minHeight: 350,
  //   checkOrigin: false
  // }, '#giveIframe');

  var dontMissCards = document.getElementsByClassName('.carousel--dont-miss .card');
  for (var i = 0; i < dontMissCards.length; i += 1) {
    dontMissCards[i].classList.add('carousel-cell');
  }

  // Buttons for Card Carousel
  $('.btn.carousel-prev').on('click', function () {
    var id = $(this).closest('.well').find('.card-deck.carousel').data('carousel-id');
    var carousel = CRDS._instances[id];
    carousel.flickity.previous();
  })
  $('.btn.carousel-next').on('click', function () {
    var id = $(this).closest('.well').find('.card-deck.carousel').data('carousel-id');
    var carousel = CRDS._instances[id];
    carousel.flickity.next();
  })

  var search = window.location.search.substring(1);
  var debug = false;
  if (search) {
    var params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,
      '":"') + '"}');
    debug = (params.debug == 'true');
  }

  CRDS.Countdown.isStreamLive().then(function (isLive) {
    if (!isLive && !debug) {
      window.location.href = '/live';
    }
  });

  // Analytics for Roll Call
  var successInterval;
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.querySelector('roll-call');

    // These events are deprecated.
    el.addEventListener('success', function (event) {
      successInterval = window.setInterval(trackLocation.bind(null, event), 100);
    });
    el.addEventListener('dismissed', function (event) {
      analytics.track('RollCallDismissed', {
        Source: 'Crossroads.net'
      });
    });

    // These events are introduced in v0.1.0
    el.addEventListener('crds.rollcall.success', function (event) {
      successInterval = window.setInterval(trackLocation.bind(null, event), 100);
    });

    el.addEventListener('crds.rollcall.dismissModal', function (event) {
      analytics.track('RollCallDismissed', {
        Source: 'Crossroads.net'
      });
    });
  });

  function trackLocation(event) {
    var data = JSON.parse(localStorage.getItem('crds-roll-call-location'))
    if (data['zip'] !== undefined) {
      clearInterval(successInterval);
      var loc = localStorage['crds-roll-call-location'];
      if (loc) {
        var method = JSON.parse(loc).context
      };

      analytics.track('RollCallSubmitted', {
        NumberOfPeople: event.detail.count,
        Zip: data['zip'],
        Lat: data['lat'],
        Long: data['lng'],
        Method: method
      });
    }
  }

  window.env = window.env || {};
  env.rollcallFormId = "1FAIpQLScrO2WZ-ODPL5mJktWXBc283_MWH7RF3fFok2qUtMGzCorhKg";
  env.rollcallFormUrl = "/forms/d/e/1FAIpQLScrO2WZ-ODPL5mJktWXBc283_MWH7RF3fFok2qUtMGzCorhKg/formResponse";
  env.rollcallFormKeys = {
    total: "entry.1403910056",
    zip: "entry.692424241",
    lng: "entry.1547032910",
    lat: "entry.1874873182",
    context: "entry.644514730"
  };
};
