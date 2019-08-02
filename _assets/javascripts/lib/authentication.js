
let oktaConfig = {
  clientId: CRDS.env.okta_client_id,
  issuer: CRDS.env.okta_oauth_base_url, //This one is a bit tricky. There are two parts. 1. This should be the fully qualified base url where your app is hosted. Maybe that's https://int.crossroads.net, https://media.crossroads.net, https://www.crossroads.net. 2. The url must be registered in the okta portal under the application redirectUri settings.
  redirectUri: getCookie('redirectUrl'),
  tokenManager: {
    storage: 'cookie'
  },
}

let mpConfig = {
  accessTokenCookie: CRDS.media.prefix + 'sessionId',
  refreshTokenCookie: CRDS.media.prefix + 'refreshToken',
  issuer: `${CRDS.env.gatewayServerEndpoint}api/authenticated`
}

let authConfig = {
  oktaConfig: oktaConfig,
  mpConfig: mpConfig,
  logging: false, //Do you want to log debug info to the web console?
  providerPreference: [
    // Put these in the order you want the library to check for auth status
    crdsAuth.CrdsAuthenticationProviders.Okta,
    crdsAuth.CrdsAuthenticationProviders.Mp
  ]
}

let authService = new crdsAuth.CrdsAuthenticationService(authConfig);

authService.authenticated().subscribe(tokens => {
  if (tokens)
    document.getElementsByTagName("crds-site-happenings")[0].setAttribute("auth-token", tokens.access_token.access_token);
});

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
