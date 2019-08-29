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
  document.querySelectorAll('[auth-token]').forEach(el => {
    el.setAttribute("auth-token", token.access_token.accessToken);
  });
}

function auth() {
  hasAuthed == true;
  if (!CRDS.env.okta_client_id || !CRDS.env.okta_oauth_base_url) {
    console.error(`Logged in homepage is not accessible without the following variables set:
OKTA_CLIENT_ID 
OKTA_OAUTH_BASE_URL`
    );
    showPage();
    return;
  }

  var auth = new Authentication();
  var path = window.document.location.pathname.replace(/^\/|\/$/g, '');

  function callback(token) {
    if (token) {
      handleLoggedInState(path);
      setComponentToken(token);
    } else {
      handleLoggedOutState(path);
    }
  }

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
hasAuthed = false;
document.addEventListener('auth-ready', auth)
document.addEventListener('env-ready', auth)
document.addEventListener('redirect-url-set', auth);
if (window.authReady && window.envReady && window.isRedirectUrlSet && !hasAuthed) auth();
