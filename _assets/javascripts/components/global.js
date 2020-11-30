(function () {
  var defJSLoaded = new Event('deferred-js-ready');
  document.dispatchEvent(defJSLoaded);
  window.deferredJSReady = true;
})();