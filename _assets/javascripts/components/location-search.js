$(document).ready(function () {
  document.addEventListener("deferred-js-ready", locationSearchInit);

  // if app-deferred loads first
  if (window.deferredJSReady) {
    locationSearchInit();
  }

  function locationSearchInit() {
    new CRDS.DistanceSorter();
  }
});
