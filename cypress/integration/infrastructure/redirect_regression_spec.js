import { RouteValidator } from '../../support/RouteValidator';
import { ContentfulLibrary } from 'crds-cypress-tools';

describe('Testing navigation between pages:', function () {
  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function () {
    const andoverSlug = '/andover';
    const lexingtonSlug = '/lexington';

    const rqm = new ContentfulLibrary.queryManager.redirectQueryManager();
    rqm.fetchSingleEntry(rqm.query.fromSlug(andoverSlug)).then(redirect =>{
      expect(redirect).to.not.be.undefined;
      expect(redirect.to.text).to.equal(lexingtonSlug);
    });

    cy.visit(andoverSlug);
    RouteValidator.pageFoundAndURLMatches(`${Cypress.config().baseUrl}${lexingtonSlug}`);
  });
});