window.onload = function () {
  var exclusions = [
    '/media/hubspot-subscribe-form-embed'
  ];
  if (exclusions.indexOf(window.location.pathname) === -1) {
    var isRedirectUrlSet = new Event('redirect-url-set');
    document.cookie = "redirectUrl=" + encodeURIComponent(window.location.href) + ";domain=.crossroads.net;path=/";
    document.dispatchEvent(isRedirectUrlSet);
    window.isRedirectUrlSet = true;
  }
};
