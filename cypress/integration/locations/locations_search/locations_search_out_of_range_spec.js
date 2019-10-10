import { oakleyResult } from '../../../fixtures/location_search_results';
import { stubLocationSearch, visitLocationsAndSearch, checkDistanceOverlayDisplayed } from './location_search_helpers';

//Warning! - The locations page sometimes loads with missing functionality. Issue captured DE6665
describe('Tests out of range location result cards', () => {
  let outOfRangeLocation;

  before(function () {
    outOfRangeLocation = oakleyResult();
    outOfRangeLocation.distance = 30.1;
    stubLocationSearch([outOfRangeLocation]);

    const keyword = '45209';
    visitLocationsAndSearch(keyword);
  });

  it('Checks Anywhere card displayed first without distance overlay', () => {
    cy.get('#section-locations > .card').first().as('firstCard');
    cy.get('@firstCard').find('[data-automation-id="anywhere-name"]').text().should('eq', 'Anywhere');
    cy.get('@firstCard').find('[data-automation-id="anywhere-name"]').should('have.attr', 'href', '/live');

    //Distance overlay not displayed
    cy.get('@firstCard').should('not.have.attr', 'data-distance');
  });

  it('Checks out of range location card displayed second with distance overlay', () => {
    cy.get('#section-locations > .card').first().next().as('secondCard');
    cy.get('@secondCard').find('[data-automation-id="location-name"]').text().should('eq', outOfRangeLocation.location.location);

    checkDistanceOverlayDisplayed('@secondCard', outOfRangeLocation.distance.toString());
  });
});