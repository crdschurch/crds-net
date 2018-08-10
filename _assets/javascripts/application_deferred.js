//= require ./vendor/imgix.min
//= require ./vendor/crds-card-carousel-v0.2.0.min
//= require ./vendor/flickity.pkgd.min
//= require ./vendor/bootstrap.min
//= require ./vendor/crds-jumbotron-video-v0.0.2.min
//= require ./components/header
//= require ./components/images
//= require ./components/carousels
//= require ./components/countdown
//= require ./components/jumbotron-video
//= require ./lib/location-finder
//= require ./lib/distance-sorter
//= require ./lib/data-tracker
//= require ./lib/card-filters
//= require ./components/filters

(function () {
<<<<<<< HEAD
    var defJSLoaded = new Event('deferred-js-ready');
    console.log('event fired');
    document.dispatchEvent(defJSLoaded);
    window.deferredJSReady = true;
  })();
=======
  var defJSLoaded = new Event('deferred-js-ready');
  document.dispatchEvent(defJSLoaded);
  window.deferredJSReady = true;
})();
>>>>>>> master
