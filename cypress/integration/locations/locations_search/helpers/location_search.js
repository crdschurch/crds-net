export function stubLocationSearchResponse(responseStub, statusCode = 200) {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/gateway/api/v1.0.0/locations/proximities?origin=*',
    status: statusCode,
    response: responseStub
  });
}

export function checkDistanceOverlayDisplayed(alias, distance) {
  cy.get(alias).should('have.attr', 'data-distance').and('eq', distance);
  cy.get(alias).find('.distance').should('contain', 'miles');
}