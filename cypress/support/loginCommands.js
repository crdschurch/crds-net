import { MinistryPlatformLoginPlugin, OktaLoginPlugin } from 'crds-cypress-login';
import { endUserSessions } from '../APIs/OktaUserAPI';

/*** Add custom commands related to logging in/out or authentication here ***/

const mpPlugin = MinistryPlatformLoginPlugin(Cypress.env('CRDS_ENV'));
Cypress.Commands.add('mpLogin', (email, password) => {
  return cy.wrap(mpPlugin.GetLoginCookies(email, password), {timeout: cy.responseTimeout})
    .then((cookies) => {
      cookies.forEach((c) => {
        cy.setCookie(c.name, c.value);
      });
      return cy.reload();
    });
});

const oktaPlugin = OktaLoginPlugin(Cypress.env('OKTA_ENDPOINT'), Cypress.env('CLIENT_ID'), Cypress.env('OKTA_SIGNIN_URL'));
Cypress.Commands.add('oktaLogin', (email, password) => {
  const cookie = oktaPlugin.GetRedirectCookie();
  cy.setCookie(cookie.name, cookie.value);

  return cy.wrap(oktaPlugin.GetAuthenticatedUrl(email, password), {timeout: cy.responseTimeout})
    .then(cy.visit);
});

/**
 * Signs the given user out.
 *   If tests are run on a live environment (int, demo, prod) command log user out by clearing local storage of tokens.
 *   If tests are run on a locally hosted environment, user's session will be ended through Okta API.
 * Why the difference? This suite allows cross-origin in order to test redirects after sign in when run in a
 *   CI/locally hosted environment. Once a user is logged in and on the homepage, Cypress loses access to the
 *   localStorage for the localhost domain, making it impossible to log a user out by clearing their stored
 *   Okta token.
 */
Cypress.Commands.add('signOutOktaUser', (oktaId) => {
  if (Cypress.config().baseUrl.includes('crossroads.net')) {
    cy.clearLocalStorage();
  } else {
    endUserSessions(oktaId);
  }
});