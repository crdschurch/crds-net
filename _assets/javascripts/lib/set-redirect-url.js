window.onload = function () {
  var isRedirectUrlSet = new Event('redirect-url-set');
  document.cookie = "redirectUrl=" + encodeURIComponent(window.location.href) + ";domain=.crossroads.net;path=/";
  document.dispatchEvent(isRedirectUrlSet);
  window.isRedirectUrlSet = true;
};
