window.onload = function() {
    //for local development redirection
    var domain = window.location.hostname;

    if(window.location.hostname.includes('crossroads')){
        domain = '.crossroads.net';
    }

    document.cookie = "redirectUrl=" + window.location.pathname + ";domain=" + domain + ";Path=/";
};