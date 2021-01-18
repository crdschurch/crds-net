describe('Testing the 404 page:', function() {
  before(function() {
    const importDeclarationsError = /.*import declarations may only appear at top level of a module.*/;
    cy.ignoreMatchingErrors([importDeclarationsError]);
    cy.visit('/404');
  });

  it('/404 should have the header, footer and search button', function() {
    cy.get('crds-shared-header').should('exist');
    cy.get('crds-shared-footer').should('exist');
    cy.get('[data-automation-id="404-search-button"]').as('404SearchButton')
      .should('exist').and('be.visible');
  });

  it.skip('/search page should load with search input when the search button is clicked', function() {
  cy.get('[data-automation-id="404-search-button"]').click();

  cy.get('.ais-SearchBox-input').as('searchField')
     .should('exist').and('be.visible');
 
  });  
});

describe('Testing invalid routes serve the expected 404 page:', () => {
  ['/notapage', '/live/notapage'].forEach((slug) => {
    it(`crossroads.net${slug}`, () => {
      cy.visit(slug, { failOnStatusCode: false });

      cy.get('crds-shared-header').should('exist');
      cy.get('crds-shared-footer').should('exist');
      cy.get('[data-automation-id="404-search-button"]').as('404SearchButton')
        .should('exist').and('be.visible');
    });
  });
});
