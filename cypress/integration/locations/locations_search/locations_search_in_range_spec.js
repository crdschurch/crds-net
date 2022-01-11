import { oakleyLocationResponse, florenceLocationResponse } from '../../../fixtures/location_search_results';
import { stubLocationSearchResponse } from './helpers/location_search';
const errorsToIgnore = [/.*> Script error.*/,/.* > a.push is not a function*/, /.*> Cannot set property 'status' of undefined*/, /.*Cannot read property 'getAttribute' of null*/, /.* > Cannot read property 'getAttribute' of null*/];

describe('Tests in range location result cards', function () {
  const nearestLocation = oakleyLocationResponse();
  nearestLocation.distance = 15;
  const nextNearestLoc = florenceLocationResponse();
  nextNearestLoc.distance = 20;

  before(function () {
    stubLocationSearchResponse([nextNearestLoc, nearestLocation]);
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('/locations');

    const oakleyZip = '45209';
    cy.get('#search-input').clear().type(oakleyZip);
    cy.get('#input-search').click();
  });

  it('Checks nearest location card displayed first with distance overlay', function () {
    cy.get('#section-locations .card').first().as('firstCard')
      .should('have.attr', 'data-distance', nearestLocation.distance.toString());

    cy.get('@firstCard').first().within(() => {
      cy.get('.card-title [data-automation-id="location-name"]')
        .invoke('text').should('eq', nearestLocation.location.location);

      cy.get('.distance').should('contain', 'miles');
    });
  });

  it('Checks second-nearest location card displayed second with distance overlay', function () {
    cy.get('#section-locations .card').first().next().as('secondCard')
      .should('have.attr', 'data-distance', nextNearestLoc.distance.toString());

    cy.get('@secondCard').within(() => {
      cy.get('[data-automation-id="location-name"]')
        .invoke('text').should('eq', nextNearestLoc.location.location);
      cy.get('.distance').should('contain', 'miles');
    });
  });
});