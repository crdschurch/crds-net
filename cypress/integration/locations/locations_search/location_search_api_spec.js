const importDeclarationsError = /.*> Cannot set property 'status' of undefined*/;

describe('Tests the location search API call', function() {
  it('Checks searching for Oakley by zip returns Oakley location first', function() {
    const oakleyZip = '45209';
    cy.ignoreMatchingErrors([importDeclarationsError]);
    cy.request(`${Cypress.env('CRDS_GATEWAY_ENDPOINT')}/api/v1.0.0/locations/proximities?origin=${oakleyZip}`)
      .its('body')
      .then((locations) => locations[0])
      .then((nearestLocation) => {
        expect(nearestLocation.location.address.zip).to.eq(oakleyZip);
        expect(nearestLocation.location.location).to.eq('Oakley');
      });
  });

  it('Checks searching for Florence by address returns Florence location first', function() {
    const florenceAddress = '828 Heights Blvd Florence KY';

    cy.request(`${Cypress.env('CRDS_GATEWAY_ENDPOINT')}/api/v1.0.0/locations/proximities?origin=${encodeURI(florenceAddress)}`)
      .its('body')
      .then((locations) => locations[0])
      .then((nearestLocation) => {
        expect(nearestLocation.location.address.addressLine1).to.eq('828 Heights Blvd');
        expect(nearestLocation.location.address.city).to.eq('Florence');
        expect(nearestLocation.location.address.state).to.eq('KY');
        expect(nearestLocation.location.location).to.eq('Florence');
      });
  });

  it('Checks searching for out of range address still returns locations with distance', function() {
    const outOfRangeLoc = 'Peru';
    const outOfRangeDistance = 30;

    cy.request(`${Cypress.env('CRDS_GATEWAY_ENDPOINT')}/api/v1.0.0/locations/proximities?origin=${outOfRangeLoc}`)
      .its('body')
      .then((locations) => locations[0])
      .then((nearestLocation) => {
        expect(nearestLocation.distance).to.be.gte(outOfRangeDistance);
      });
  });

  it('Checks searching for garbage returns error response', function() {
    const garbageLoc = 'iqupwetoup;djnoipw';

    cy.request({
      url: `${Cypress.env('CRDS_GATEWAY_ENDPOINT')}/api/v1.0.0/locations/proximities?origin=${garbageLoc}`,
      failOnStatusCode: false
    }).its('status').should('eq', 400);
  });
});