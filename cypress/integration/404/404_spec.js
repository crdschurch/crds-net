describe('Testing the 404 page:', () => {
  before(() => {
    cy.visit('/404');
  });

  it('/404 should have the header, footer and search button', () => {
    cy.get('crds-shared-header').should('exist');
    cy.get('crds-shared-footer').should('exist');
    cy.get('[data-automation-id="404-search-button"]').as('404SearchButton')
      .should('exist').and('be.visible');
  });

  it('/search page should load when the search button is clicked', () => {
    cy.get('[data-automation-id="404-search-button"]').as('404SearchButton')
      .click();

    cy.get('.ais-SearchBox-input').as('searchField')
      .should('exist').and('be.visible');
  });
});
