
const errorsToIgnore =  [ /.*> Script error.*/, /.* > a.push is not a function*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > errorList.find is not a function*/, /.* > Cannot set property 'status' of undefined*/];

describe('Testing the 404 page:', function() {
  before(function() {
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('/404');
  });

  it('/404 should have the header, footer and search button', function() {
    cy.get('crds-shared-header').should('exist');
    cy.get('crds-shared-footer').should('exist');
    cy.get('[data-automation-id="404-search-button"]').as('404SearchButton')
      .should('exist').and('be.visible');
  });

  it('/search page should load with search input when the search button is clicked', function() {
    cy.get('[data-automation-id="404-search-button"]').click();
    cy.get('.ais-SearchBox-input').as('searchField')
      .should('exist').and('be.visible');
  });  
});

describe('Testing invalid routes serve the expected 404 page:', () => {
  ['/notapage', '/live/notapage'].forEach((slug) => {
    it(`crossroads.net${slug}`, () => {
      cy.ignoreMatchingErrors(errorsToIgnore);
      cy.visit(slug, { failOnStatusCode: false });

      cy.get('crds-shared-header').should('exist');
      cy.get('crds-shared-footer').should('exist');
      cy.get('[data-automation-id="404-search-button"]').as('404SearchButton')
        .should('exist').and('be.visible');
    });
  });
});