import { RouteValidator } from '../../support/RouteValidator';
import { doesNotReject } from 'assert';

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo').as('crossroadsLogo').click();
  RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/`);
}

describe('Clicking the Crossroads logo from a non-Netlify page should load the Netlify homepage:', function () {
  it('(DE6317) Starting from /search', function () {
    cy.visit('/search', { timeout: 20000 });

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('(DE6319) Starting from /corkboard', function () {
    cy.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('Cypress detected that an uncaught error was thrown from a cross origin script.');
      done();
      return false;
    });

    cy.visit('/corkboard', { timeout: 20000 });

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('Starting from /leaveyourmark', function () {
    cy.visit('/leaveyourmark', { timeout: 20000 });

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });
});

describe('Clicking the Crossroads logo from a Netlify page should load the Netlify homepage:', function () {
  it.skip('Starting from /volunteer', function () {
    cy.visit('/volunteer');
    RouteValidator.pageShouldBeFromNetlify();

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it.skip('Starting from /live', function () {
    cy.visit('/live');
    RouteValidator.pageShouldBeFromNetlify();

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('Starting from /giving', function () {
    cy.visit('/giving');
    RouteValidator.pageShouldBeFromNetlify();

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });
});