/*** Add configuration that must be applied to every test here ***/
/* ex. Stubs for blacklisted hosts */

Cypress.on('window:before:load', (win) => {
  // We've blacklisted the Google Tag Manager host, so we need to stub some of
  //  the methods it provided to avoid errors.
  // You can make assertions against these stubs, 
  //  ex. cy.get('@analytics.track').should('have.been.calledWith', 'VideoStarted');
  win.analytics = {
    track: cy.stub().as('analytics.track')
  };
});