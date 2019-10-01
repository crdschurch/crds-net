function auth() {
  if(!window.authReady || !window.envReady) return;
  
  var auth = new Authentication();

  function callback(tokens) {
    if (!tokens) window.location.href = '/signin';
    else {
      document.querySelector('[data-preloader]').style.opacity = 0;
      document.querySelector('[data-preloader]').style.zIndex = -1;
    }
  }
  
  auth.authenticate(callback);
}

document.addEventListener('auth-ready', auth)
document.addEventListener('env-ready', auth)
if(window.authReady && window.envReady) auth();

