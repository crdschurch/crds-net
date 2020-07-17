import { normalizeText } from 'crds-cypress-contentful';

/*** Add custom commands that work with elements here ***/

Cypress.Commands.add('normalizedText', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('have.prop', 'textContent').then(normalizeText); 
});

Cypress.Commands.add('text', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('have.prop', 'textContent');
});

/**
 * Given selector must be an element selector, not an alias
 */
Cypress.Commands.add('imgixShouldRunOnElement', { prevSubject: false}, (selector, imageAsset) => {
  if (imageAsset && imageAsset.isPublished) {
    cy.get(selector)
      .should('have.attr', 'src')
      .and('contain', imageAsset.sys_id);
  }

  // Imigx should run when in view
  cy.get(selector)
    .first()
    .scrollIntoView()
    .then(() => {
      // Imgix detaches the element from the DOM when processing, 
      //  so we must re-find it before testing
      cy.get(selector)
        .should('be.visible')
        .and('have.attr', 'srcset');
    });
});