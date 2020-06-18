describe('Testing the 404 page:', function () {
  before(function () {
    cy.on('uncaught:exception', (err, runnable) => {
        return false
    })
    cy.visit('/404');
  });

  it('/404 should have the header, footer and search button', function () {
    cy.get('crds-shared-header').should('exist');
    cy.get('crds-shared-footer').should('exist');
    cy.get('[data-automation-id="404-search-button"]').as('404SearchButton').should('exist').and('be.visible');
  });

  it('/search page should load when the search button is clicked', function () {
  const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/, /.*Cannot set property staus o undefined.*/];
  cy.ignoreMatchingErrors(errorsToIgnore);
      cy.wait(5000);
      cy.get('[data-automation-id="404-search-button"]').as('404SearchButton');
      cy.get('@404SearchButton').click();

    cy.get('.ais-SearchBox-input').as('searchField');
    cy.get('@searchField').should('exist').and('be.visible');
  });
});

describe('Testing invalid routes serve the expected 404 page:', function () {
  ['/notapage', '/live/notapage'].forEach(slug => {
      it(`crossroads.net${slug}`, function () {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
      cy.visit(slug, { failOnStatusCode: false });

      cy.get('crds-shared-header').should('exist');
      cy.get('crds-shared-footer').should('exist');
      cy.get('[data-automation-id="404-search-button"]').as('404SearchButton').should('exist').and('be.visible');
    });
  });
});
