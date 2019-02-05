import { RouteValidator } from '../../support/RouteValidator';

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo').as('crossroadsLogo').click();
  RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}/`);
}

describe('As a signed-in user, clicking the Crossroads logo from a non-Netlify page should load the Netlify homepage:', function () {
  beforeEach(function () {
    cy.login('mpcrds+auto+fredflintstone@gmail.com', Cypress.env('TEST_USER_PW'));
  });

  it('(DE6319) Starting from /corkboard', function (){
    cy.visit('corkboard/', { timeout: 10000 });

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('Starting from /childcare', function (){
    cy.visit('childcare/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('Starting from /serve-signup', function (){
    cy.visit('serve-signup/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });
});