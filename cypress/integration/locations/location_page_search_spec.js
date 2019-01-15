import { ContentfulApi } from '../../Contentful/ContentfulApi';

function searchForLocation(keyword){
  cy.server();
  cy.route('/gateway/api/v1.0.0/locations/proximities?origin=*').as('searchResults');

  cy.get('[data-automation-id="location-search"]').as('search');
  cy.get('@search').find('input').clear().type(keyword);
  cy.get('@search').find('button').click();

  //Wait for search request to return
  cy.wait('@searchResults');
}

describe('Testing the Locations page without searching:', function() {
  let locations;
  before(function() {
    const content = new ContentfulApi();
    locations = content.retrieveLocationList();

    cy.wrap({locations}).its('locations.locationCount').should('not.be.undefined').then(() => {
      assert.isAbove(locations.locationCount, 0, 'Sanity check: At least one location is served from Contentful');
    });

    cy.visit('/locations');
  });

  it('Location cards should display alphabetically followed by Anywhere', function() {
    const sortedLocations = locations.sortedByNameAndSlug;
    let i;
    cy.get('#section-locations > .card').as('locationCards');

    for(i = 0; i < locations.locationCount; i++){
      cy.get('@locationCards').eq(i).should('be.visible');
      cy.get('@locationCards').eq(i).find('a').should('have.attr', 'href', `/${sortedLocations[i].slug.text}`);
    }

    //Check anywhere
    i = locations.locationCount;
    cy.get('@locationCards').eq(i).find('a').should('have.attr', 'href', '/live');
  });

  it('Distance should not be displayed on Location cards', function(){
    cy.get('#section-locations > .card').first().as('firstLocation');

    cy.get('@firstLocation').should('not.have.attr', 'data-distance');
    cy.get('@firstLocation').find('.distance').should('not.exist');
  });
});

describe('Testing the search functionality on the Locations page:', function() {
  let locations;
  before(function() {
    const content = new ContentfulApi();
    locations = content.retrieveLocationList();

    cy.wrap({locations}).its('locations.locationCount').should('not.be.undefined').then(() => {
      assert.isAbove(locations.locationCount, 0, 'Sanity check: At least one location is served from Contentful');
    });

    cy.visit('/locations');
  });

  //For a Contentful Location card to display the distance, its address must be valid
  it('Searching for Oakley by zip should display the Oakley card first, with its distance', function(){
    const oakleyLocation = locations.getLocationBySlug('oakley');
    const oakleyZip = '45209';

    searchForLocation(oakleyZip);

    cy.get('#section-locations > .card').first().as('oakleyCard');
    cy.get('@oakleyCard').should('be.visible');
    cy.get('@oakleyCard').find('a').should('have.attr', 'href').and('contains', oakleyLocation.slug.text);

    //Distance overlay displayed
    cy.get('@oakleyCard').should('have.attr', 'data-distance').and('be.gte', 0);
    cy.get('@oakleyCard').find('.distance').should('contain', 'miles');
  });

  it('Searching for Florence by address should display the Florence card first', function(){
    const florenceLocation = locations.getLocationBySlug('florence');
    const florenceAddress = '828 Heights Blvd Florence KY';

    searchForLocation(florenceAddress);

    cy.get('#section-locations > .card').first().as('florenceCard');
    cy.get('@florenceCard').should('be.visible');
    cy.get('@florenceCard').find('a').should('have.attr', 'href').and('contains', florenceLocation.slug.text);
  });

  it('Searching for an out of range location should display the Anywhere card first', function(){
    const outOfRangeLocation = 'Peru';

    searchForLocation(outOfRangeLocation);

    cy.get('#section-locations > .card').first().as('anywhereCard');
    cy.get('@anywhereCard').should('be.visible');
    cy.get('@anywhereCard').find('a').should('have.attr', 'href').and('contains', '/live');
    cy.get('@anywhereCard').find('.card-title > a').should('contain', 'Anywhere');
  });

  it('An error should display after searching for nonsense text, then should disappear after a valid search', function(){
    const invalidSearch = 'iqupwetoup;djnoipw';
    const validSearch = 'Peru';

    searchForLocation(invalidSearch);

    cy.get('[data-automation-id="locations-carousel"] > .error-text').as('searchError').should('be.visible');

    searchForLocation(validSearch);

    cy.get('@searchError').should('not.exist');
  });
});