// import { normalizeText } from 'crds-cypress-contentful';

// /*** Add custom commands that work with elements here ***/

// Cypress.Commands.add('normalizedText', { prevSubject: 'element' }, (subject) => {
//   return cy.wrap(subject).should('have.prop', 'textContent').then(normalizeText); 
// });

import { normalizeText } from 'crds-cypress-contentful';

Cypress.Commands.add('normalizedText', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('have.prop', 'textContent').then(elementText => normalizeText(elementText));
});

/**
 * Confirms Imgix has processed the given image. 
 * Imgix detaches the image element from the DOM, so the following must be done when calling this command
 *   - Element must be in view so Imgix has been triggered
 *   - Given selector must be an element selector, not an alias
 */
Cypress.Commands.add('imgixShouldRunOnElement', { prevSubject: false }, (selector, imageAsset) => {
  if (imageAsset && imageAsset.isPublished) {
    cy.get(selector)
      .should('have.attr', 'src')
      .and('contain', imageAsset.sys_id);
  }

  cy.get(selector)
    .should('be.visible')
    .and('have.attr' , 'src');
});