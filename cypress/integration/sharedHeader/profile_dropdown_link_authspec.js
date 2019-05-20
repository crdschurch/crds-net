import { RouteValidator } from '../../support/RouteValidator';
import { fred_flintstone } from '../../fixtures/test_users';
import { ProfileMenu } from './support/ProfileMenu';

const profileLinksMatchURL = [{
  name: 'MyProfile',
  elementRef: '#crds-shared-header-profile',
  url: `${Cypress.config().baseUrl}/profile/personal`
}, {
  name: 'MyTrips',
  elementRef: '#crds-shared-header-trips',
  url: `${Cypress.config().baseUrl}/trips/mytrips`
}, {
  name: 'MyCamps',
  elementRef: '#crds-shared-header-camps',
  url: `${Cypress.config().baseUrl}/mycamps`
}, {
  name: 'Childcare',
  elementRef: '#crds-shared-header-childcare',
  url: `${Cypress.config().baseUrl}/childcare`
}];

const profileLinksContainURL =[{
  name: 'SignUpToServe',
  elementRef: '#crds-shared-header-serve',
  url: 'serve.crossroads.net/groups/week-of'
}, {
  name: 'MyGroups',
  elementRef: '#crds-shared-header-groups',
  url: 'connect'
}];

describe('As a signed-in user, the links in the My Profile menu should load pages', function () {
  let profileMenu;
  before(function () {
    cy.login(fred_flintstone.email, fred_flintstone.password);
  });

  beforeEach(function () {
    cy.stayLoggedIn();

    cy.ignoreUncaughtException('Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/prayer');

    profileMenu = new ProfileMenu();
    profileMenu.forceOpen();
  });

  it('Tests "Giving" loads expected page when clicked', function () {
    cy.get('#crds-shared-header-desktop').contains('Giving').as('giving');

    profileMenu.clickLink('giving');

    RouteValidator.pageShouldNotBe404();
  });

  profileLinksMatchURL.forEach(profileLink => {
    it(`Tests "${profileLink.name}" loads ${profileLink.url} when clicked`, function () {
      const linkAlias = `${profileLink.name}Link`;
      cy.get(profileLink.elementRef).as(linkAlias);

      profileMenu.clickLink(linkAlias);

      RouteValidator.pageShouldNotBe404();
      RouteValidator.pageShouldMatchUrl(profileLink.url);
    });
  });

  profileLinksContainURL.forEach(profileLink => {
    it(`Tests "${profileLink.name}" does not 404 when clicked`, function () {
      const linkAlias = `${profileLink.name}Link`;
      cy.get(profileLink.elementRef).as(linkAlias);

      profileMenu.clickLink(linkAlias);

      RouteValidator.pageShouldNotBe404();
      cy.url().should('contain', profileLink.url);
    });
  });
});