function redirectUnauthenticated() {
  if (!document.cookie.includes('userId') || !document.cookie.includes(CRDS.media.prefix + 'refreshToken')) {
    window.location.href = '/signin';
  } else {
    document.querySelector('[data-preloader]').style.opacity = 0;
    document.querySelector('[data-preloader]').style.zIndex = -1;
  }
}

document.addEventListener("redirect-url-set", redirectUnauthenticated);

if (window.isRedirectUrlSet) {
  redirectUnauthenticated();
}