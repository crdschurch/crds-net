import { fred_flintstone } from '../../fixtures/test_users';

//Don't run in Prod because requires authentication and test user doesn't exist in Prod
describe('Tests Happening section is displayed', function () {
  before(function(){
    //There seems to be a bug in bitmovin.js and/or autoplay-controller.js (aka autoplay.js) 
    //  that allows the 'pause' function to be called on an instance of 
    //  the window.bitmovin.player.Player class before the class was created. This is probably
    //  a load-order issue since both scripts are loaded asynchronously. Attempts to stub
    //  out the problematic functions were unsuccessful.
    //This can be reproduced by a real user with the same console error as below but the impact
    //  is minimal so lets just ignore it for now.
    const bitmovinPlayerError = /.*Cannot read property\W+pause\W+of undefined.*/;
    cy.ignoreMatchingErrors([bitmovinPlayerError]);
  });

  after(function () {      
    cy.signOutOktaUser(fred_flintstone.oktaId);
  });

  it('Checks happenings section exists for logged-out user', function () {
    cy.visit('/');
    cy.get('site-happenings-vertical')
      .scrollIntoView({ top: 100 })
      .should('have.prop', 'shadowRoot').and('not.be.null');
  });

  it('Checks happenings section exists for logged-in user (MP authentication)', function () {
    cy.mpLogin(fred_flintstone.email, fred_flintstone.password);
    cy.visit('/');

    cy.get('crds-happenings-horizontal')
      .scrollIntoView({ top: 100 })
      .should('have.prop', 'shadowRoot')
      .and('not.be.null');
  });

  it('Checks happenings section exists for logged-in user (Okta authentication)', function () {
    // Setup route for final step of auth process so it isn't cancelled
    cy.server();
    cy.route('/oauth2/v1/keys').as('keys');
    cy.clearLocalStorage(); 
  //  cy.signOutOktaUser(fred_flintstone.oktaId); //Make sure user is logged out


    cy.oktaLogin(fred_flintstone.email, fred_flintstone.password)
      .then(function () {
        cy.visit('/');
        cy.wait('@keys', {timeout: 15000});
        cy.reload();
        cy.url().should('not.contain', Cypress.env('OKTA_SIGNIN_URL'));
      });
  
    cy.get('crds-happenings-horizontal')
      .scrollIntoView({ top: 100 })
      .should('have.prop', 'shadowRoot').and('not.be.null');
  });
});