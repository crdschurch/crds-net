function pageShouldBeFromNetlify() {
  cy.get('head meta[name="Netlify"]').should('exist');
}

function sharedHeaderShouldExist() {
  cy.get('.crds-shared-header').as('sharedHeader').should('exist').and('be.visible');
  //This button is defined in the header content block. If fails, check content block was imported.
  cy.get('@sharedHeader').find('[data-automation-id="sh-giving"]').as('headerGiveButton');
  cy.get('@headerGiveButton').should('exist').and('be.visible');
}

function sharedFooterShouldExist(){
  cy.get('.site-footer').as('sharedFooter').should('exist').and('be.visible');
  //This link is defined in the footer content block. If fails, check content block was imported.
  cy.get('@sharedFooter').find('[data-automation-id="footer-oakley-location"]').as('footerOakleyLink');
  cy.get('@footerOakleyLink').should('exist').and('be.visible');
}

function searchFieldShouldExist(){
  cy.get('[data-automation-id="404-search-field"]').as('searchField').should('exist').and('be.visible');
}

describe('Testing the 404 page:', function () {
  before(function () {
    cy.visit('/404');
  });

  it('/404 should be served by Netlify', function () {
    pageShouldBeFromNetlify();
  });

  it('/404 should have the header, footer and search field', function () {
    sharedHeaderShouldExist();
    sharedFooterShouldExist();
    searchFieldShouldExist();
  });
});

describe('Testing Netlify serves 404 page on invalid routes', function () {
  //These will fail until proxy swap is working correctly
  it('crossroads.net/notapage should serve Netlify 404', function () {
    cy.visit('/notapage', { failOnStatusCode: false });
    pageShouldBeFromNetlify();
    sharedHeaderShouldExist();
    sharedFooterShouldExist();
    searchFieldShouldExist();
  });

  it('crossroads.net/live/notapage should serve Netlify 404', function () {
    cy.visit('/live/notapage', { failOnStatusCode: false });
    pageShouldBeFromNetlify();
    sharedHeaderShouldExist();
    sharedFooterShouldExist();
    searchFieldShouldExist();
  });

  //TODO what other pages do we cover?
});