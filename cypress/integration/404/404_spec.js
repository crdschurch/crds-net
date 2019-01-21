
describe('Testing the 404 page:', function () {
  it('/404 should have the header, footer and search field', function () {
    cy.visit('/404');

    cy.get('.crds-shared-header').as('sharedHeader').should('exist').and('be.visible');
    //This button is defined in the header content block. If fails, check content block was imported.
    cy.get('@sharedHeader').find('[data-automation-id="sh-giving"]').as('headerGiveButton');
    cy.get('@headerGiveButton').should('exist').and('be.visible');

    cy.get('.site-footer').as('sharedFooter').should('exist').and('be.visible');
    //This link is defined in the footer content block. If fails, check content block was imported.
    cy.get('@sharedFooter').find('[data-automation-id="footer-oakley-location"]').as('footerOakleyLink');
    cy.get('@footerOakleyLink').should('exist').and('be.visible');

    cy.get('[data-automation-id="404-search-field"]').as('searchField').should('exist').and('be.visible');
  });
});