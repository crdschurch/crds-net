import { RouteValidator } from '../../support/RouteValidator';

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo').as('crossroadsLogo').click();
  RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/`);
}

describe('Clicking the Crossroads logo from a non-Netlify page should load the Netlify homepage:', function () {
  it.skip('(DE6317) Starting from /search', function () {
    cy.visit('search/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it.skip('(DE6319) Starting from /corkboard', function () {
    cy.visit('corkboard/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it.skip('Starting from /leaveyourmark', function () {
    cy.visit('leaveyourmark/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });
});

describe('Clicking the Crossroads logo from a Netlify page should load the Netlify homepage:', function () {
  it('Starting from /serve', function () {
    cy.visit('serve/');
    RouteValidator.pageShouldBeFromNetlify();

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('Starting from /live', function () {
    cy.visit('live/');
    RouteValidator.pageShouldBeFromNetlify();

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it.skip('Starting from /camps', function () {
    cy.visit('camps/');
    RouteValidator.pageShouldBeFromNetlify();

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });
});