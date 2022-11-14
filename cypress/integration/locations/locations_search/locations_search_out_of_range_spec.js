import { uptownLocationResponse } from '../../../fixtures/location_search_results';
import { stubLocationSearchResponse } from './helpers/location_search';

const errorsToIgnore = [/.*> Cannot read property 'attributes' of undefined*/, /.*> Cannot read property 'getLocationDistances' of undefined*/, /.*> Script error.*/, /.*> Cannot convert undefined or null to object*/, /.* > a.push is not a function*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > errorList.find is not a function*/, /.* > Cannot set property 'status' of undefined*/];

describe('Tests out of range location result cards', function () {
  const outOfRangeLocation = uptownLocationResponse();
  outOfRangeLocation.distance = "11.5 miles";

  beforeEach(function () {
    stubLocationSearchResponse([outOfRangeLocation]);
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('/locations');

    const farAwayZip = '45209';
    cy.get('#search-input').clear().type(farAwayZip, '{enter}');
    cy.get('#search-input').type('{enter}')
    cy.get('#input-search').click({ force: true });
  });

  it('Checks Anywhere card displayed first without distance overlay', function () {
    cy.get('#section-locations .card').first().as('firstCard')
      .should('not.have.attr', 'data-distance');

    cy.get('@firstCard').within(() => {
      cy.get('[data-automation-id="location-name"]')
        .invoke('text').should('eq', 'Anywhere');
      cy.get('[data-automation-id="location-name"]')
        .should('have.attr', 'href', '/anywhere');
    });
  });

  it('Checks out of range location card displayed', function () {
    cy.get('[data-location="Uptown"] > .distance').as('secondCard')
      .invoke('text').should('eq', outOfRangeLocation.distance.toString());
  });
});