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

import { Formatter } from './Formatter';

Cypress.Commands.add('normalizedText', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('have.prop', 'textContent').then(elementText => Formatter.normalizeText(elementText));
});

Cypress.Commands.add('text', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('have.prop', 'textContent');
});

//Here for convenience but use sparingly - we usually want these to be thrown
Cypress.Commands.add('ignoreUncaughtException', (expectedMessage) => {
  cy.on('uncaught:exception', (err) => {
    expect(err.message).to.include(expectedMessage);
    return !err.message.includes(expectedMessage);
  });
});

//Here for convenience but use sparingly - we usually want these to be thrown
Cypress.Commands.add('ignorePropertyUndefinedTypeError', () => {
  cy.on('uncaught:exception', (err) => {
    //Sees error, posts assertion to console, fails if not matching
    const propertyUndefinedRegex = /.*Cannot read property\W+\w+\W+of undefined.*/;
    expect(err.message).to.match(propertyUndefinedRegex);
    return err.message.match(propertyUndefinedRegex) == null;
  });
});
