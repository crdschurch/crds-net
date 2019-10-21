describe('Tests the location search API call', () => {
  before(() => {
    cy.server();
  });

  it('Checks searching for Oakley by zip returns Oakley location first', () => {
    const oakleyZip = '45209';

    cy.request(`${Cypress.env('gateway_endpoint')}/gateway/api/v1.0.0/locations/proximities?origin=${oakleyZip}`).then(results => {
      const nearestLocation = results.body[0];
      expect(nearestLocation.location.address.zip).to.eq(oakleyZip);
      expect(nearestLocation.location.location).to.eq('Oakley');
    });
  });

  it('Checks searching for Florence by address returns Florence location first', () => {
    const florenceAddress = '828 Heights Blvd Florence KY';

    cy.request(`${Cypress.env('gateway_endpoint')}/gateway/api/v1.0.0/locations/proximities?origin=${encodeURI(florenceAddress)}`).then(results => {
      const nearestLocation = results.body[0];
      expect(nearestLocation.location.address.addressLine1).to.eq('828 Heights Blvd');
      expect(nearestLocation.location.address.city).to.eq('Florence');
      expect(nearestLocation.location.address.state).to.eq('KY');
      expect(nearestLocation.location.location).to.eq('Florence');
    });
  });

  it('Checks searching for out of range address still returns locations with distance', () => {
    const outOfRangeLoc = 'Peru';
    const outOfRangeDistance = 30;

    cy.request(`${Cypress.env('gateway_endpoint')}/gateway/api/v1.0.0/locations/proximities?origin=${outOfRangeLoc}`).then(results => {
      const nearestLocation = results.body[0];
      expect(nearestLocation.distance).to.be.gte(outOfRangeDistance);
    });
  });

  it('Checks searching for garbage returns error response', () => {
    const garbageLoc = 'iqupwetoup;djnoipw';

    cy.request({
      url: `${Cypress.env('gateway_endpoint')}/gateway/api/v1.0.0/locations/proximities?origin=${garbageLoc}`,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(400);
    });
  });
});