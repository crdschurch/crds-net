import { RouteValidator } from '../../support/RouteValidator';
import { RedirectQueryManager } from '../../Contentful/QueryManagers/RedirectQueryManager';

describe('Testing navigation between pages:', function () {
  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function () {
    const andoverSlug = '/andover';
    const lexingtonSlug = '/lexington';

    const rqm = new RedirectQueryManager();
    rqm.fetchRedirectFrom(andoverSlug).then(() =>{
      const redirect = rqm.queryResult;
      expect(redirect).to.not.be.undefined;
      expect(redirect.to.text).to.equal(lexingtonSlug);
    });

    cy.visit(andoverSlug);
    RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}${lexingtonSlug}`);
  });
});