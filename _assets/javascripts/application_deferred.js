//= require ./vendor/webcomponents-lite.min
//= require ./vendor/imgix.min
//= require ./vendor/bootstrap.min
//= require ./vendor/flickity.pkgd.min
//= require ./vendor/crds-card-carousel-v0.2.0.min
//= require ./vendor/crds-jumbotron-video-v0.0.2.min
//= require ./vendor/crds-livestream-reminder-v0.0.16.min
//= require ./vendor/crds-rollcall.min
//= require ./vendor/crds-status-message-v0.1.3.min
//= require ./components/header
//= require ./components/images
//= require ./components/carousels
//= require ./components/countdown
//= require ./components/jumbotron-video
//= require ./lib/location-finder
//= require ./lib/distance-sorter
//= require ./lib/data-tracker
//= require ./lib/card-filters
//= require ./lib/height-watcher
//= require ./components/filters
//= require ./components/legacy-imgix
//= require ./vendor/imgix-optimizer
//= require ./components/simple-fred
//= require ./components/status-message
//= require ./lib/smooth-scroller

(function () {
  var defJSLoaded = new Event('deferred-js-ready');
  document.dispatchEvent(defJSLoaded);
  window.deferredJSReady = true;
})();
