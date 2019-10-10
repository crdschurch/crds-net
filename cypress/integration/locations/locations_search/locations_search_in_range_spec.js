import { oakleyResult, florenceResult } from '../../../fixtures/location_search_results';
import { stubLocationSearch, visitLocationsAndSearch, checkDistanceOverlayDisplayed } from './helpers/location_search';

//Warning! - The locations page sometimes loads with missing functionality. Issue captured DE6665
describe('Tests in range location result cards', () => {
  let nearestLocation;
  let nextNearestLoc;

  before(function () {
    nearestLocation = oakleyResult();
    nearestLocation.distance = 15;
    nextNearestLoc = florenceResult();
    nextNearestLoc.distance = 20;
    stubLocationSearch([nextNearestLoc, nearestLocation]);

    const keyword = '45209';
    visitLocationsAndSearch(keyword);
  });

  it('Checks nearest location card displayed first with distance overlay', () => {
    cy.get('#section-locations > .card').first().as('firstCard');
    cy.get('@firstCard').find('[data-automation-id="location-name"]').text().should('eq', nearestLocation.location.location);

    checkDistanceOverlayDisplayed('@firstCard', nearestLocation.distance.toString());
  });

  it('Checks second-nearest location card displayed second with distance overlay', () => {
    cy.get('#section-locations > .card').first().next().as('secondCard');
    cy.get('@secondCard').find('[data-automation-id="location-name"]').text().should('eq', nextNearestLoc.location.location);

    checkDistanceOverlayDisplayed('@secondCard', nextNearestLoc.distance.toString());
  });
});