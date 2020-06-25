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
    var subDomain = filterForCorrectSubdomain(CRDS.env.environment);

    if (isCorrectName == true || cookieValue == undefined) {
      document.cookie =
        cookieName +
        encodeURIComponent(window.location.href) +
        ";domain=" +
        subDomain +
        ".crossroads.net;path=/";
    }

    function filterForCorrectSubdomain(subDomainPrefix) {
      if (subDomainPrefix == "" || subDomainPrefix == "production")
        return "www";
      if (subDomainPrefix == "development") return "local";
      return subDomainPrefix;
    }

    document.dispatchEvent(isRedirectUrlSet);
    window.isRedirectUrlSet = true;
  }
};
