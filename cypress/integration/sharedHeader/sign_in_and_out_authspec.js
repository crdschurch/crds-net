import { RouteValidator } from '../../support/RouteValidator';
import { fred_flintstone } from '../../fixtures/test_users';
import { openProfileClickLinkAndConfirmLoad } from './support/my_profile_menu';

describe('As a user I should be able to sign in and out through the shared header buttons:', function () {
  beforeEach(function() {
    cy.visit('/');

    //Define common buttons
    cy.get('#crds-shared-header-desktop-signin').as('signInButton');
    cy.get('#crds-shared-header-desktop-toggle').find('.profile-picture').as('myProfileIcon');
    cy.get('#crds-shared-header-desktop').find('#crds-shared-header-signout').as('signOutButton');
  });

  it('The My Profile icon should expand into a menu when clicked', function(){
    cy.login(fred_flintstone.email, fred_flintstone.password);

    cy.get('@myProfileIcon').should('be.visible').click();

    cy.get('#crds-shared-header-desktop').as('myProfileMenu').should('be.visible');
  });

  it('I can sign in from the Homepage using the signin button in the header', function () {
    cy.get('@signInButton').should('be.visible').click();

    RouteValidator.pageShouldMatchUrl(`${Cypress.config().baseUrl}/signin`);
    RouteValidator.pageShouldNotBe404();

    cy.get('#login-page-email').as('emailField').type(fred_flintstone.email);
    cy.get('#login-page-password').as('passwordField').type(fred_flintstone.password);
    cy.get('#submit_nav').as('signin').click();

    RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}`);
    cy.get('@myProfileIcon').should('be.visible');
  });

  it('I can sign out from the Homepage using the signout link in the header', function () {
    cy.login(fred_flintstone.email, fred_flintstone.password);

    cy.get('@myProfileIcon').should('be.visible');

    const signoutURL = `${Cypress.config().baseUrl}/signout`;
    openProfileClickLinkAndConfirmLoad('signOutButton', signoutURL);

    cy.get('@myProfileIcon').should('not.be.visible');
    cy.get('@signInButton').should('be.visible');
    RouteValidator.pageFoundAndFromNetlify(`${Cypress.config().baseUrl}`);
  });
});