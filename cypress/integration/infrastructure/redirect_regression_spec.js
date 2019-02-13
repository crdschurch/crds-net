import { ContentfulApi } from '../../Contentful/ContentfulApi';
import { RouteValidator } from '../../support/RouteValidator';

describe('Testing navigation between pages:', function () {
  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function () {
    //Make sure this redirect still exists
    const redirectList = ContentfulApi.retrieveRedirectList();
    cy.wrap({redirectList}).its('redirectList.listReady').should('not.be.undefined').then(() => {
      const andoverRedirect = redirectList.getRedirectFrom('/andover');
      expect(andoverRedirect.to.text).to.contain('/lexington');
    });

    cy.visit('andover');
    RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/lexington`);
  });
});