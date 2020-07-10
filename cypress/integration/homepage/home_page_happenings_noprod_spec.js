import { fred_flintstone } from '../../fixtures/test_users';

Cypress.on('window:before:load', (win) => {
  // Stub out call to bitmovin to avoid the uncaught exception related to "pause". 
  // WARNING: this will probably prevent autoplay from working
  win.bitmovin = cy.stub().as('bitmovin');
});

describe('Tests Happening section is displayed', function() {
  after(function() {
    cy.signOutOktaUser(fred_flintstone.oktaId);
  });

  it('Checks happenings section exists for logged-out user', function() {
    cy.visit('/');
    cy.get('site-happenings-vertical')
      .scrollIntoView({ top: 100 })
      .should('have.prop', 'shadowRoot').and('not.be.null');
  });

  it('Checks happenings section exists for logged-in user (MP authentication)', function() {
    cy.mpLogin(fred_flintstone.email, fred_flintstone.password);
    cy.visit('/');

    cy.get('crds-site-happenings')
      .scrollIntoView({ top: 100 })
      .should('have.prop', 'shadowRoot').and('not.be.null');
  });

  it('Checks happenings section exists for logged-in user (Okta authentication)', function() {
    // Setup route for final step of auth process so it isn't cancelled
    cy.server();
    cy.route('/oauth2/default/v1/keys').as('keys');
    cy.signOutOktaUser(fred_flintstone.oktaId); //Make sure user is logged out

    cy.oktaLogin(fred_flintstone.email, fred_flintstone.password)
      .then(function() {
        cy.wait('@keys');
        cy.url().should('not.contain', Cypress.env('OKTA_SIGNIN_URL'));
        cy.reload(); //Workaround - when using Okta auth the logged out homepage loads first. Remove once this is fixed
      });

    cy.get('crds-site-happenings')
      .scrollIntoView({ top: 100 })
      .should('have.prop', 'shadowRoot').and('not.be.null');
  });
});