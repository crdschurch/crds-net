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
  Cypress.on('uncaught:exception', (err) => {
    const matchingError = errorList.find(errorRegex => err.message.match(errorRegex) !== null);

    if(matchingError){
      expect(err.message).to.match(matchingError); //Post result to console
    }

    return matchingError === undefined;
  });
});
