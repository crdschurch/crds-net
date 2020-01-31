import { RouteValidator } from '../../support/RouteValidator';
import { RedirectQueryManager } from 'crds-cypress-contentful';

describe('Testing navigation between pages:', function () {
  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function () {
    const andoverSlug = '/andover';
    const lexingtonSlug = '/lexington';

    const rqm = new RedirectQueryManager();
    rqm.getSingleEntry(rqm.query.fromSlug(andoverSlug)).then(redirect =>{
      expect(redirect).to.not.be.undefined;
      expect(redirect.to.text).to.equal(lexingtonSlug);
    });
    cy.on('uncaught:exception', (err, runnable) => {
        return false
    }) 

    cy.visit(andoverSlug);
    RouteValidator.pageFoundAndURLMatches(`${Cypress.config().baseUrl}${lexingtonSlug}`);
  });
});