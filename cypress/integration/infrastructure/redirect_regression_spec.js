import { RouteValidator } from '../../support/RouteValidator';
import { RedirectManager } from '../../Contentful/Models/RedirectModel';

describe('Testing navigation between pages:', function () {
  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function () {
    const andoverSlug = '/andover';
    const redirectManager = new RedirectManager();
    redirectManager.saveRedirectsFromSlug(andoverSlug);

    cy.wrap({ redirectManager }).its('redirectManager.savedRedirects').should('have.hasOwnProperty', andoverSlug).then(() => {
      const andoverRedirect = redirectManager.getRedirectBySlug(andoverSlug);
      expect(andoverRedirect.to.text).to.contain('/lexington');
    });

    cy.visit(andoverSlug);
    RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/lexington`);
  });
});