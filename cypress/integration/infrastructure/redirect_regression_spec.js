function pageShouldBeFromNetlify() {
  cy.get('meta[name="Netlify"]').as('metaFromNetlify').should('exist');
}

function pageShouldNotBe404() {
  cy.get('[data-automation-id="404-search-field"]').as('404SearchBar').should('not.exist');
}

function clickCrossroadsLogoAndConfirmNetlifyHomepageLoads() {
  cy.get('#crds-shared-header-logo').as('crossroadsLogo').click();
  cy.url().should('be', Cypress.config().baseUrl);
  pageShouldBeFromNetlify();
  pageShouldNotBe404();
}

//TODO should have function to click logo and verify?
describe('Testing navigation between pages:', function () {
  it('(DE6317) Using the Crossroads logo to navigate out of /search should land on the Netlify homepage', function () {
    cy.visit('search/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('(DE6319) Using the Crossroads logo to navigate out of /corkboard should land on the Netlify homepage', function () {
    cy.visit('corkboard/');

    clickCrossroadsLogoAndConfirmNetlifyHomepageLoads();
  });

  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function () {
    //first check andover/lexington redirect exists

    cy.visit('andover');
    cy.url().should('be', `${Cypress.config().baseUrl}/lexington`);
    pageShouldBeFromNetlify();
    pageShouldNotBe404();
  });
});