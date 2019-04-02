import { RouteValidator } from '../../support/RouteValidator';
import { fred_flintstone } from '../../fixtures/test_users';

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo', { timeout: 20000 }).as('crossroadsLogo').click();
  RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/`);
}

describe('As a signed-in user, clicking the Crossroads logo from a non-Netlify page should load the Netlify homepage:', function () {
  beforeEach(function () {
    cy.login(fred_flintstone.email, fred_flintstone.password);
  });

  ['/corkboard', '/childcare', '/serve-signup'].forEach(slug => {
    it(`Starting from ${slug}`, function () {
      cy.ignoreUncaughtException('Uncaught TypeError: Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
      cy.ignoreUncaughtException('Cypress detected that an uncaught error was thrown from a cross origin script.'); //Intermitted corkboard issue. Do not remove.

      cy.visit(slug);

      clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
    });
  });

  //Special case
  // it('(DE6319) Starting from /corkboard', function () {
  //   cy.ignoreUncaughtException('Cypress detected that an uncaught error was thrown from a cross origin script.');
  //   cy.visit('/corkboard', { timeout: 20000 });

  //   clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  // });

  // it('Starting from /childcare', function () {
  //   cy.visit('/childcare');

  //   clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  // });

  // it('Starting from /serve-signup', function () {
  //   cy.visit('/serve-signup');

  //   clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  // });
});