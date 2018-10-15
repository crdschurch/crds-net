describe('Homepage JumboTron Overlay', function() {
    before(function() {
      cy.visit('https://int.crossroads.net');
    })

    it('Verifies Jumbotron components are only visible when opened', function(){
      cy.get('[data-automation-id="watch-cta"]').click();

      cy.get('[data-automation-id="jumbotron-overlay"]').should('have.css', 'opacity', '1');
      cy.get('[data-automation-id="recentService"]').should('have.css', 'opacity', '1');
      cy.get('[data-automation-id="stream-service"]').should('have.css', 'opacity', '1');

      cy.get('[data-automation-id="overlay-close"]').click();

      cy.get('[data-automation-id="jumbotron-overlay"]').should('have.css', 'opacity', '0');
      cy.get('[data-automation-id="recentService"]').should('have.css', 'opacity', '1');
      cy.get('[data-automation-id="stream-service"]').should('have.css', 'opacity', '1');
    })
  })