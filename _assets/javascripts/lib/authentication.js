class Authentication {
  constructor() {
    const oktaConfig = {
      clientId: CRDS.env.okta_client_id,
      issuer: CRDS.env.okta_oauth_base_url,
      redirectUri: 'https://int.crossroads.net/', //This one is a bit tricky. There are two parts. 1. This should be the fully qualified base url where your app is hosted. Maybe that's https://int.crossroads.net, https://media.crossroads.net, https://www.crossroads.net. 2. The url must be registered in the okta portal under the application redirectUri settings.
      tokenManager: {
        storage: 'cookie'
      }
    };

    const mpConfig = {
      accessTokenCookie: CRDS.media.prefix + 'sessionId',
      refreshTokenCookie: CRDS.media.prefix + 'refreshToken',
      issuer: `${CRDS.env.gatewayServerEndpoint}api/authenticated`
    };

    const authConfig = {
      oktaConfig: oktaConfig,
      mpConfig: mpConfig,
      logging: false, //Do you want to log debug info to the web console?
      providerPreference: [
        // Put these in the order you want the library to check for auth status
        crdsAuth.CrdsAuthenticationProviders.Okta,
        crdsAuth.CrdsAuthenticationProviders.Mp
      ]
    }

    this.authService = new crdsAuth.CrdsAuthenticationService(authConfig);

  }

  authenticate(callback) {
    this.authService.authenticated().subscribe(tokens => {
        callback(tokens);
    });
  }

  getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }
}

var authReady = new Event('auth-ready');
document.dispatchEvent(authReady);
window.authReady = true;
