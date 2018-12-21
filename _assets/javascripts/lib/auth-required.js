function redirectUnauthenticated() {
  if (document.cookie.includes(CRDS.media.prefix + 'refreshToken')) {
    getAuth().done((data, textStatus, xhr) => {

      var headers = xhr.getAllResponseHeaders();
      document.querySelector('[data-preloader]').style.opacity = 0;
      document.querySelector('[data-preloader]').style.zIndex = -1;

      if (!headers.sessionId) return;

      setCookie(CRDS.media.prefix + 'refreshToken', headers.refreshToken, 24);
      setCookie(CRDS.media.prefix + ' sessionId', headers.sessionId, 24);

    }).fail(() => { window.location.href = '/signin'; });
  } else {
    window.location.href = '/signin';
  }
}

document.addEventListener("redirect-url-set", redirectUnauthenticated);

if (window.isRedirectUrlSet) {
  redirectUnauthenticated();
}

function getAuth() {
  const authURL = `${CRDS.env.gatewayServerEndpoint}api/authenticated`;
  return $.ajax({
    url: authURL,
    dataType: 'json',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    beforeSend(request) {
      request.setRequestHeader('Authorization', getCookie(CRDS.media.prefix + 'sessionId'));
      request.setRequestHeader('RefreshToken', getCookie(CRDS.media.prefix + 'refreshToken'));
    }
  });
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}