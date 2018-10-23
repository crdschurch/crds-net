// document.getElementsByTagName("html")[0].style.visibility = "hidden";

function redirectUnauthenticated() {
  if (!document.cookie.includes('userId')) {
    window.location.href = '/signin';
  } else {
    document.getElementsByTagName("html")[0].style.visibility = "visible";
  }
}

document.addEventListener("redirect-url-set", redirectUnauthenticated);

if (window.isRedirectUrlSet) {
  redirectUnauthenticated();
}