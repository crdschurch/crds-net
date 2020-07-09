/* eslint-disable no-console */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { MinistryPlatformLoginPlugin, OktaLoginPlugin } from 'crds-cypress-login';
import { endUserSessions } from '../APIs/OktaUserAPI';
import { normalizeText } from 'crds-cypress-contentful';

/*** Test Setup ***/
// This will be applied to all tests automatically
Cypress.on('window:before:load', (win) => {
  // We've blacklisted the Google Tag Manager host, so we need to stub some of
  //  the methods it provided.
  win.analytics = {
    track: cy.stub().as('track')
  };

  // We've blacklisted HotJar, so stub some of its methods
  win.hj = cy.stub().as('hotjar');
});



/*** Custom Commands ***/
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

Cypress.Commands.add('normalizedText', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('have.prop', 'textContent').then(normalizeText); 
});

Cypress.Commands.add('text', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('have.prop', 'textContent');
});

/*
* Ignore exceptions that match the regexes in the given array.
* This call must be added to every test, or in a beforeEach clause, before the
* error may be thrown.
* https://docs.cypress.io/api/events/catalog-of-events.html#To-catch-a-single-uncaught-exception
* Note that errors are only ignored during the test's run, not during before or after hooks
*/
// For example:
// beforeEach(() => {
//  const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/];
//  cy.ignoreMatchingErrors(errorsToIgnore);
// });
Cypress.Commands.add('ignoreMatchingErrors', (errorList) => {
  cy.on('uncaught:exception', (err) => {
    const matchingError = errorList.find(errorRegex => err.message.match(errorRegex) !== null);

    if(matchingError){
      expect(err.message).to.match(matchingError); //Post result to console
    }

    return matchingError === undefined;
  });
});


/*TODO:
- update cypress config to use include file (and npm script) (looks like some conflicts with 1.0.1? try after upgrade)
- update cypress to 4.8.0
- make image validator class into commands (they currently run outside the test stack so don't fail test)
- make RouteValidator commands?
- make autoplay event listener a spy - but remove the api.amplitude? it may have been inadvertently blacklisted
- Make sure function () and aliases are used everywhere!
- can remove-markdown be removed?

*/