import { RouteValidator } from '../../support/RouteValidator';

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo').as('crossroadsLogo').click();
  cy.url().should('be', Cypress.config().baseUrl);
  RouteValidator.pageShouldBeFromNetlify();
  RouteValidator.pageShouldNotBe404();
}

describe.skip('Testing that clicking the Crossroads logo loads the Netlify homepage:', function () {
  it('(DE6317) Starting from /search', function () {
    cy.visit('search/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('(DE6319) Starting from /corkboard', function () {
    cy.visit('corkboard/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });
});