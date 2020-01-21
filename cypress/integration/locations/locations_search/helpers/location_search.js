export function stubLocationSearch(responseStub, statusCode=200) {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/gateway/api/v1.0.0/locations/proximities?origin=*',
    status: statusCode,
    response: responseStub
  });
}

export function visitLocationsAndSearch(keyword, retries = 2) {
  cy.on('uncaught:exception', (err) => {
    //Sees error, posts message to console, fails if not matching
    const propertyUndefinedRegex = /.*Cannot read property\W+\w+\W+of undefined.*/;
    const undefinedObjectRegex = /.*Cannot convert undefined or null to object.*/;
    if(err.message.match(propertyUndefinedRegex) !== null ||
    err.message.match(undefinedObjectRegex) !== null){

      retries -= 1;
      console.log(`ERROR found! ${err.message}. ${retries} retries left visiting /locations.`);
      if(retries > 0){
        visitLocationsAndSearch(keyword, retries);
        return false;
      }
    }
    return true;
  });

    cy.on('uncaught:exception', (err, runnable) => {
        return false
    }) 
  cy.visit('/locations');

  cy.get('[data-automation-id="location-search"]').as('search');
    cy.get('#search-input').clear().type(keyword);
    cy.get('#input-search').click();
}

export function checkDistanceOverlayDisplayed(alias, distance) {
  cy.get(alias).should('have.attr', 'data-distance').and('eq', distance);
  cy.get(alias).find('.distance').should('contain', 'miles');
}