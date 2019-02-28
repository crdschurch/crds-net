import { RouteValidator } from '../../support/RouteValidator';
import { fred_flintstone } from '../../fixtures/test_users';
import { openProfileClickLinkAndConfirmLoad, forceOpenProfileDropdown } from './support/my_profile_menu';

describe('As a signed-in user, the links in the My Profile menu should load pages', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.login(fred_flintstone.email, fred_flintstone.password);
  });

  it('Tests "My Profile" loads expected page when clicked', function () {
    cy.get('#crds-shared-header-profile').as('myProfile');

    openProfileClickLinkAndConfirmLoad('myProfile');

    const myProfileURL = `${Cypress.config().baseUrl}/profile/personal`;
    RouteValidator.pageShouldMatchUrl(myProfileURL);
  });

  it('Tests "Giving" loads expected page when clicked', function () {
    forceOpenProfileDropdown();
    cy.get('#crds-shared-header-desktop').contains('Giving').as('giving');
    cy.get('@giving').click();

    RouteValidator.pageShouldNotBe404();
  });

  it('Tests "Sign Up to Serve" does not 404 when clicked', function () {
    cy.get('#crds-shared-header-serve').as('signUpToServe');

    openProfileClickLinkAndConfirmLoad('signUpToServe');
  });

  it('Tests "My Groups" does not 404 when clicked', function () {
    cy.get('#crds-shared-header-groups').as('myGroups');

    openProfileClickLinkAndConfirmLoad('myGroups');
  });

  it('Tests "My Trips" loads expected page when clicked', function () {
    cy.get('#crds-shared-header-trips').as('myTrips');

    openProfileClickLinkAndConfirmLoad('myTrips');

    const myTripsURL = `${Cypress.config().baseUrl}/trips/mytrips`;
    RouteValidator.pageShouldMatchUrl(myTripsURL);
  });

  it('Tests "My Students Camps" loads expected page when clicked', function () {
    cy.get('#crds-shared-header-camps').as('myCamps');

    openProfileClickLinkAndConfirmLoad('myCamps');

    const myCampsURL = `${Cypress.config().baseUrl}/mycamps`;
    RouteValidator.pageShouldMatchUrl(myCampsURL);
  });

  it('Tests "Childcare" loads expected page when clicked', function () {
    cy.get('#crds-shared-header-childcare').as('childcare');

    openProfileClickLinkAndConfirmLoad('childcare');

    const childcareURL = `${Cypress.config().baseUrl}/childcare`;
    RouteValidator.pageShouldMatchUrl(childcareURL);
  });
});