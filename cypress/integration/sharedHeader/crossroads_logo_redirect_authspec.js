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

  it('(DE6319) Starting from /corkboard', function () {
    //TODO test this on Travis - does this catch the cross-origin issue?
    cy.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('TODO: replace once error is hit');
      done();
      return false;
    });

    cy.visit('/corkboard', { timeout: 20000 });

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('Starting from /childcare', function () {
    cy.visit('/childcare');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('Starting from /serve-signup', function () {
    cy.visit('/serve-signup');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });
});