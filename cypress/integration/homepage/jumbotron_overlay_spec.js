describe('Homepage JumboTron Overlay', function() {    

    it('Visits Crossroads Homepage', function() {
      cy.visit('https://int.crossroads.net');
    })

    it('clicks the watch CTA button', function() {
      cy.get('[data-automation-id="watch-cta"]').click();
    })

    it('shows the jumbotron overlay', function() {
      cy.get('[data-automation-id="jumbotron-overlay"]').should('have.css', 'opacity', '1');
    })

    it('shows the recent service', function() {
      cy.get('[data-automation-id="recentService"]').should('be.visible');
    })

    it('shows streamService', function() {
      cy.get('[data-automation-id="stream-service"]').should('be.visible');
      
    })

    it('closes the overlay', function() {
      cy.get('[data-automation-id="overlay-close"]').click();
      cy.get('[data-automation-id="jumbotron-overlay"]').should('have.css', 'opacity', '0');
    })
  })