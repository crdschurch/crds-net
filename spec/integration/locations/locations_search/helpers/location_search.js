export function stubLocationSearchResponse(responseStub, statusCode = 200) {
  cy.server();
  cy.route({
    method: 'GET',
    url: '/gateway/api/v1.0.0/locations/proximities?origin=*',
    status: statusCode,
    response: responseStub
  });
}