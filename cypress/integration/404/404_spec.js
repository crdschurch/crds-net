import { RouteValidator } from '../../support/RouteValidator';

function sharedHeaderShouldExist() {
  cy.get('.crds-shared-header').as('sharedHeader').should('exist').and('be.visible');
  //This button is defined in the header content block. If fails, check content block was imported.
  cy.get('@sharedHeader').find('[data-automation-id="sh-giving"]').as('headerGiveButton');
  cy.get('@headerGiveButton').should('exist').and('be.visible');
}

function sharedFooterShouldExist() {
  cy.get('.site-footer').as('sharedFooter').should('exist').and('be.visible');
  //This link is defined in the footer content block. If fails, check content block was imported.
  cy.get('@sharedFooter').find('[data-automation-id="footer-oakley-location"]').as('footerOakleyLink');
  cy.get('@footerOakleyLink').should('exist').and('be.visible');
}

function searchButtonShouldExist() {
  cy.get('[data-automation-id="404-search-button"]').as('404SearchButton').should('exist').and('be.visible');
}

describe('Testing the 404 page:', function () {
  before(function () {
    cy.visit('/404');
  });

  it('/404 should be served by Netlify', function () {
    RouteValidator.pageShouldBeFromNetlify();
  });

  it('/404 should have the header, footer and search button', function () {
    sharedHeaderShouldExist();
    sharedFooterShouldExist();
    searchButtonShouldExist();
  });

  it('/search page should load when the search button is clicked', function () {
    cy.get('[data-automation-id="404-search-button"]').as('404SearchButton');
    cy.get('@404SearchButton').click();

    cy.get('.ais-SearchBox-input').as('searchField');
    cy.get('@searchField').should('exist').and('be.visible');
  });
});

describe('Testing 404 page from invalid routes are served by Netlify:', function () {
  ['/notapage', '/live/notapage'].forEach(slug => {
    it(`crossroads.net${slug} should serve Netlify 404`, function () {
      cy.visit(slug, { failOnStatusCode: false });
      RouteValidator.pageShouldBeFromNetlify();
      sharedHeaderShouldExist();
      sharedFooterShouldExist();
      searchButtonShouldExist();
    });
  });
});