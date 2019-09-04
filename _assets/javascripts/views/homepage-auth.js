/*
  Logic in this file is explicitly for LI and LO homepages
*/

function showPage() {
  document.getElementsByTagName('html')[0].setAttribute("style", "opacity: 100");
}

function hidePage() {
  document.getElementsByTagName('html')[0].setAttribute("style", "opacity: 0");
}

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
  const path = window.document.location.pathname.replace(/^\/|\/$/g, '');
  if (token) {
    handleLoggedInState(path);
    setComponentToken(token);
  } else {
    handleLoggedOutState(path);
  }
}

function auth() {
  if (!window.authReady || !window.envReady || hasAuthed) return;
  hasAuthed = true;

  var auth = new Authentication();
  auth.authenticate(callback);
}

function handleLoggedInState(path) {
  if (path === 'h') { // h is the location of the new logged in homepage
    showPage();
  } else {
    window.location.href = '/h';
  }
}

function handleLoggedOutState(path) {
  if (path === "h") {
    window.location.href = '/signin';
  } else {
    showPage();
  }
}

hidePage();
var hasAuthed = false;
document.addEventListener('auth-ready', auth)
document.addEventListener('env-ready', auth)
if (window.authReady && window.envReady) auth();
