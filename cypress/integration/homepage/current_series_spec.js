describe('Homepage', function() {    

    it('Visits Crossroads Homepage', function() {
      cy.visit('https://int.crossroads.net');
    })

    it('current series is displayed', function() {
      cy.get('.current-series').should('be.visible');
    })

  })