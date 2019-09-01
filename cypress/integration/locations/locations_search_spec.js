//Workaround for DE6665 - The locations page sometimes loads with missing functionality.
function visitLocationsWithRetry(retries){
  cy.on('uncaught:exception', (err) => {
    //Sees error, posts message to console, fails if not matching
    const propertyUndefinedRegex = /.*Cannot read property\W+\w+\W+of undefined.*/;
    const undefinedObjectRegex = /.*Cannot convert undefined or null to object.*/;
    if(err.message.match(propertyUndefinedRegex) !== null ||
    err.message.match(undefinedObjectRegex) !== null){

      retries -= 1;
      console.log(`ERROR found! ${err.message}. Retries left visiting locations ${retries}`);
      if(retries > 0){
        visitLocationsWithRetry(retries);
        return false;
      }
    }
    return true;
  });

  cy.visit('/locations');

  //Searching triggers the errors we're catching above. If search is successful, page should be ready.
  searchForLocation(' ');
}

function searchForLocation(keyword) {
  cy.server();
  cy.route('/gateway/api/v1.0.0/locations/proximities?origin=*').as('searchResults');

  cy.get('[data-automation-id="location-search"]').as('search');
  cy.get('@search').find('input').clear().type(keyword);

  return cy.get('@search').find('button:not([disabled=""])', {timeout: 50000}).click().then(() => {
    //Wait for search request to return
    return cy.wait('@searchResults', { timeout: 50000 });
  });
}

describe('Given I search for a standard location on /locations:', function () {
  before(function () {
    visitLocationsWithRetry(2);
  });

  //For a Contentful Location card to display the distance, its address must be valid
  it('Searching for Oakley by zip should display the Oakley card first, with its distance', function () {
    const oakleySlug = '/oakley';
    const oakleyZip = '45209';

    searchForLocation(oakleyZip).then(() => {
      cy.get('#section-locations > .card').first().as('oakleyCard');
      cy.get('@oakleyCard').should('be.visible');
      cy.get('@oakleyCard').find('[data-automation-id="location-name"]').should('have.attr', 'href').and('contains', oakleySlug);

      //Distance overlay displayed
      cy.get('@oakleyCard').should('have.attr', 'data-distance').and('be.gte', 0);
      cy.get('@oakleyCard').find('.distance').should('contain', 'miles');
    });
  });

  it('Searching for Florence by address should display the Florence card first', function () {
    const florenceSlug = '/florence';
    const florenceAddress = '828 Heights Blvd Florence KY';

    searchForLocation(florenceAddress).then(() => {
      cy.get('#section-locations > .card').first().as('florenceCard');
      cy.get('@florenceCard').should('be.visible');
      cy.get('@florenceCard').find('[data-automation-id="location-name"]').should('have.attr', 'href').and('contains', florenceSlug);
    });
  });
});


describe('Given I search for a non-standard location on /locations', function () {
  beforeEach(function () {
    visitLocationsWithRetry(2);
  });

  it('Searching for an out of range location should display the Anywhere card first', function () {
    const outOfRangeLocation = 'Peru';

    searchForLocation(outOfRangeLocation).then(() => {
      cy.get('#section-locations > .card').first().as('anywhereCard');
      cy.get('@anywhereCard').should('be.visible');
      cy.get('@anywhereCard').find('[data-automation-id="anywhere-name"]').should('have.attr', 'href').and('contains', '/live');
      cy.get('@anywhereCard').find('[data-automation-id="anywhere-name"]').should('contain', 'Anywhere');
    });
  });

  it('An error should display after searching for nonsense text, then should disappear after a valid search', function () {
    const invalidSearch = 'iqupwetoup;djnoipw';
    const validSearch = 'Peru';

    searchForLocation(invalidSearch).then(() => {
      cy.get('[data-automation-id="locations-carousel"] > .error-text').as('searchError').should('be.visible');
    }).then(() => {
      searchForLocation(validSearch).then(() => {
        cy.get('@searchError').should('not.exist');
      });
    });
  });
});
