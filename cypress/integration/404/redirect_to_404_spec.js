
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