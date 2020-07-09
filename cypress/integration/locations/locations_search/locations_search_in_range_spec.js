import { oakleyLocationResponse, florenceLocationResponse } from '../../../fixtures/location_search_results';
import { checkDistanceOverlayDisplayed, stubLocationSearchResponse } from './helpers/location_search';

describe('Tests in range location result cards', function() {
  let nearestLocation;
  let nextNearestLoc;

  before(function() {
    nearestLocation = oakleyLocationResponse();
    nearestLocation.distance = 15;
    nextNearestLoc = florenceLocationResponse();
    nextNearestLoc.distance = 20;
    stubLocationSearchResponse([nextNearestLoc, nearestLocation]);
    
    cy.visit('/locations');

    const oakleyZip = '45209';
    cy.get('#search-input').clear().type(oakleyZip);
    cy.get('#input-search').click();
  });

  it('Checks nearest location card displayed first with distance overlay', function() {
    cy.get('#section-locations > .card').first().as('firstCard');
    cy.get('@firstCard').find('[data-automation-id="location-name"]').text().should('eq', nearestLocation.location.location);

    checkDistanceOverlayDisplayed('@firstCard', nearestLocation.distance.toString());
  });

  it('Checks second-nearest location card displayed second with distance overlay', function() {
    cy.get('#section-locations > .card').first().next().as('secondCard');
    cy.get('@secondCard').find('[data-automation-id="location-name"]').text().should('eq', nextNearestLoc.location.location);

    checkDistanceOverlayDisplayed('@secondCard', nextNearestLoc.distance.toString());
  });
});