window.onload = function () {
  var redirectUrlSet = new Event('redirect-url-set');
  document.cookie = "redirectUrl=" + encodeURIComponent(window.location.href) + ";domain=.crossroads.net;path=/";
  document.dispatchEvent(redirectUrlSet);
  window.redirectUrlSet = true;
};
