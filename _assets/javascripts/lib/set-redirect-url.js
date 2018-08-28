window.onload = function() {
    //for local development redirection
    var domain = window.location.hostname;

    if(window.location.hostname.includes('crossroads')){
        domain = '.crossroads.net';
    }
    var uri = encodeURIComponent(window.location.href);
    document.cookie = "redirectUrl=" + uri + ";domain=" + domain + ";Path=/";
};