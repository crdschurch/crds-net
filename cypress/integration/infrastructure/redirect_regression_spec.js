import { RouteValidator } from '../../support/RouteValidator';
import { ContentfulQueryBuilder } from 'crds-cypress-contentful';

describe('Testing navigation between pages:', () => {
  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', () => {
    const andoverSlug = '/andover';
    const lexingtonSlug = '/lexington';

    const qb = new ContentfulQueryBuilder('redirect');
    qb.select = 'fields.from,fields.to';
    qb.searchFor = `fields.from=${andoverSlug}`;
    qb.limit = 1;
    cy.task('getCNFLResource', qb.queryParams).as('lexington')
      .its('to.text')
      .should('exist')
      .and('eq', lexingtonSlug);
    
    cy.visit(andoverSlug);
    RouteValidator.pageFoundAndURLMatches(`${Cypress.config().baseUrl}${lexingtonSlug}`);
  });
});