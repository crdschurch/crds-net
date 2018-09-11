// if live-stream loads first
document.addEventListener("deferred-js-ready", homeInit);

// if app-deferred loads first
if (window.deferredJSReady) {
  homeInit();
}

function homeInit() {
  // Scroll Locations
  var locationButton = document.getElementById('find-location');
  var locationScroll = function (event) {
    event.preventDefault();
    document.querySelector('[data-locations-section]').scrollIntoView(true);
  }

  locationButton.addEventListener('click', locationScroll);

  // Jumbotron Overlay
  var watchButton = document.getElementById('watch-cta');
  var closeButton = document.getElementById('overlay-close');
  var overlay = document.getElementById('overlay');

  function showOverlay(event) {
    event.preventDefault();
    overlay.classList.add('visible');
  }

  function hideOverlay() {
    overlay.classList.remove('visible');
  }

  watchButton.addEventListener('click', showOverlay);
  closeButton.addEventListener('click', hideOverlay);

  var trackerInt;
  var buildTracker = function () {
    if (typeof analytics !== "undefined") {
      clearInterval(trackerInt);
      new CRDS.DataTracker();
    }
  };
  trackerInt = setInterval(function () {
    buildTracker();
  }, 250);
}
