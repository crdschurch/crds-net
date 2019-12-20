window.onload = function() {
  var exclusions = ["/media/hubspot-subscribe-form-embed"];
  if (exclusions.indexOf(window.location.pathname) === -1) {
    var isRedirectUrlSet = new Event("redirect-url-set");
    var cookieName = "redirectUrl=";
    var domainValue = document.domain;
    var cookieValue = document.cookie
      .split(";")
      .find(selectedCookie => selectedCookie.startsWith(" " + cookieName));
    var isCorrectName = cookieValue ? cookieValue.includes(domainValue) : false;

    if (isCorrectName == true || cookieValue == undefined) {
      document.cookie =
        cookieName +
        encodeURIComponent(window.location.href) +
        ";domain=.crossroads.net;path=/";
    }

    document.dispatchEvent(isRedirectUrlSet);
    window.isRedirectUrlSet = true;
  }
};
