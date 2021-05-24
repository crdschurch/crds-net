(function () {
  var defJSLoaded = new Event('deferred-js-ready');
  window.deferredJSReady = true;
  document.dispatchEvent(defJSLoaded);
})();
