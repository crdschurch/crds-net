import { RouteValidator } from '../../support/RouteValidator';

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo').as('crossroadsLogo').click();
  RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/`);
}

describe('Clicking the Crossroads logo from page on a microclient should load the Netlify homepage:', function () {
  ['/search', '/leaveyourmark', '/corkboard'].forEach(slug => {
    it(`Starting from ${slug}`, function () {
      cy.ignoreUncaughtException('Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
      cy.ignoreUncaughtException('Cypress detected that an uncaught error was thrown from a cross origin script.'); //Intermitted corkboard issue. Do not remove.

      cy.visit(slug, { timeout: 30000 });

      clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
    });
  });
});

describe('Clicking the Crossroads logo from a Netlify page should load the Netlify homepage:', function () {
  ['/live', '/giving', '/volunteer'].forEach(slug => {
    it(`Starting from ${slug}`, function () {
      cy.ignoreUncaughtException('Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed

      cy.visit(slug, { timeout: 20000 });
      RouteValidator.pageShouldBeFromNetlify();

      clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
    });
  });
});