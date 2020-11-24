import { ContentfulQueryBuilder } from 'crds-cypress-contentful';

describe('Testing navigation between pages:', function() {
  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function() {
    const andoverSlug = '/andover';
    const lexingtonSlug = '/lexington';

    const qb = new ContentfulQueryBuilder('redirect');
    qb.select = 'fields.from,fields.to';
    qb.searchFor = `fields.from=${andoverSlug}`;
    cy.task('getCNFLResource', qb.queryParams).as('lexington')
      .its('to.text')
      .should('exist')
      .and('eq', lexingtonSlug);
    
    cy.visit(andoverSlug);

    const lexingtonRegex = new RegExp(`${Cypress.config().baseUrl}${lexingtonSlug}/?`);
    cy.url().should('match', lexingtonRegex);
    cy.get('[data-automation-id="404-search-field"]').as('404SearchField')
      .should('not.exist'); // Not on 404 page
  });
});