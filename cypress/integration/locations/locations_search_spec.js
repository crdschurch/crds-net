import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { LocationQueryManager } from '../../Contentful/QueryManagers/LocationQueryManager';

function searchForLocation(keyword) {
  cy.server();
  cy.route('/gateway/api/v1.0.0/locations/proximities?origin=*').as('searchResults');

  cy.get('[data-automation-id="location-search"]').as('search');
  cy.get('@search').find('input').clear().type(keyword);
  cy.get('@search').find('button').click();

  //Wait for search request to return
  cy.wait('@searchResults');
}

describe('Testing the Locations page without searching:', function () {
  let locationList;
  let firstLocation;
  before(function () {
    const queryManager = new LocationQueryManager();
    queryManager.fetchLocationsSortedByNameThenSlug().then(() => {
      locationList = queryManager.queryResult;
      firstLocation = locationList[0];
      firstLocation.fetchLinkedResources();
    });

    cy.ignoreUncaughtException('Uncaught TypeError: Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/locations');
  });

  it('Location cards should display alphabetically followed by Anywhere', function () {
    cy.get('#section-locations > .card').as('locationCards');

    let i;
    for (i = 0; i < locationList.length; i++) {
      cy.get('@locationCards').eq(i).should('be.visible');
      cy.get('@locationCards').eq(i).find('[data-automation-id="location-name"]').should('have.attr', 'href', `/${locationList[i].slug.text}`);
    }

    //Check anywhere
    i = locationList.length;
    cy.get('@locationCards').eq(i).find('[data-automation-id="anywhere-name"]').should('have.attr', 'href', '/live');
  });

  it('Distance should not be displayed on Location cards', function () {
    cy.get('#section-locations > .card').first().as('firstLocation');

    cy.get('@firstLocation').should('not.have.attr', 'data-distance');
    cy.get('@firstLocation').find('.distance').should('not.exist');
  });

  it('Should have a Name, Image, Address, Service times and link to Map', function () {
    const firstLocation = locationList[0];
    cy.get('#section-locations > .card').first().as('firstLocation');

    cy.get('@firstLocation').find('[data-automation-id="location-name"]').as('title');
    cy.get('@title').should('have.text', firstLocation.name.text);
    cy.get('@title').should('have.attr', 'href').and('contain', firstLocation.slug.text);

    cy.get('@firstLocation').find('[data-automation-id="location-address"]').as('address');
    cy.get('@address').normalizedText().should('contain', firstLocation.address.displayedText);

    cy.get('@firstLocation').find('[data-automation-id="location-map-url"]').as('mapLink');
    cy.get('@mapLink').should('have.attr', 'href', firstLocation.mapURL.text);

    cy.get('@firstLocation').find('[data-automation-id="location-service-times"]').as('serviceTimes');
    cy.get('@serviceTimes').normalizedText().should('contain', firstLocation.serviceTimes.displayedText);

    cy.get('@firstLocation').find('[data-automation-id="location-image"]').find('img').as('image');
    new ImageDisplayValidator('image', false).shouldHaveImgixImage(firstLocation.image);
  });
});

describe('Testing the search functionality on the Locations page:', function () {
  before(function () {
    cy.ignoreUncaughtException('Uncaught TypeError: Cannot read property \'cards\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/locations');
  });

  //For a Contentful Location card to display the distance, its address must be valid
  it('Searching for Oakley by zip should display the Oakley card first, with its distance', function () {
    const oakleySlug = '/oakley';
    const oakleyZip = '45209';

    searchForLocation(oakleyZip);

    cy.get('#section-locations > .card').first().as('oakleyCard');
    cy.get('@oakleyCard').should('be.visible');
    cy.get('@oakleyCard').find('[data-automation-id="location-name"]').should('have.attr', 'href').and('contains', oakleySlug);

    //Distance overlay displayed
    cy.get('@oakleyCard').should('have.attr', 'data-distance').and('be.gte', 0);
    cy.get('@oakleyCard').find('.distance').should('contain', 'miles');
  });

  it('Searching for Florence by address should display the Florence card first', function () {
    const florenceSlug = '/florence';
    const florenceAddress = '828 Heights Blvd Florence KY';

    searchForLocation(florenceAddress);

    cy.get('#section-locations > .card').first().as('florenceCard');
    cy.get('@florenceCard').should('be.visible');
    cy.get('@florenceCard').find('[data-automation-id="location-name"]').should('have.attr', 'href').and('contains', florenceSlug);
  });

  it('Searching for an out of range location should display the Anywhere card first', function () {
    const outOfRangeLocation = 'Peru';

    searchForLocation(outOfRangeLocation);

    cy.get('#section-locations > .card').first().as('anywhereCard');
    cy.get('@anywhereCard').should('be.visible');
    cy.get('@anywhereCard').find('[data-automation-id="anywhere-name"]').should('have.attr', 'href').and('contains', '/live');
    cy.get('@anywhereCard').find('[data-automation-id="anywhere-name"]').should('contain', 'Anywhere');
  });

  it('An error should display after searching for nonsense text, then should disappear after a valid search', function () {
    const invalidSearch = 'iqupwetoup;djnoipw';
    const validSearch = 'Peru';

    searchForLocation(invalidSearch);

    cy.get('[data-automation-id="locations-carousel"] > .error-text').as('searchError').should('be.visible');

    searchForLocation(validSearch);

    cy.get('@searchError').should('not.exist');
  });
});