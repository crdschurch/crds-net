import { RouteValidator } from '../../support/RouteValidator';

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo').as('crossroadsLogo').click();
  RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/`);
}

describe('Clicking the Crossroads logo from a non-Netlify page should load the Netlify homepage:', function () {
  ['/search', '/leaveyourmark', '/corkboard'].forEach(slug => {
    it(`Starting from ${slug}`, function () {
      cy.ignoreUncaughtException('Uncaught TypeError: Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
      cy.ignoreUncaughtException('Cypress detected that an uncaught error was thrown from a cross origin script.'); //Intermitted corkboard issue. Do not remove.

      cy.visit(slug, { timeout: 20000 });

      clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
    });
  });
});

describe('Clicking the Crossroads logo from a Netlify page should load the Netlify homepage:', function () {
  it.skip('Starting from /volunteer', function () {
    cy.visit('/volunteer');
    RouteValidator.pageShouldBeFromNetlify();

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  ['/live', '/giving'].forEach(slug => {
    it(`Starting from ${slug}`, function () {
      cy.visit(slug, { timeout: 20000 });
      RouteValidator.pageShouldBeFromNetlify();

      clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
    });
  });
});