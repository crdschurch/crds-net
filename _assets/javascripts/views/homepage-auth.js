function setComponentToken(token) {
  function replaceAuthToken() {
    document.querySelectorAll('[auth-token]').forEach(el => {
      el.setAttribute("auth-token", token.access_token.accessToken);
    });
  }

  if (window.componentsReady)
    replaceAuthToken();
  document.addEventListener('components-ready', replaceAuthToken);

}

function callback(token) {
  if (token)
    setComponentToken(token);
}

function auth() {
  if (!window.authReady || !window.envReady || hasAuthed) return;
  hasAuthed = true;

  var auth = new Authentication();
  auth.authenticate(callback);
}

var hasAuthed = false;
document.addEventListener('auth-ready', auth)
document.addEventListener('env-ready', auth)
if (window.authReady && window.envReady) auth();
