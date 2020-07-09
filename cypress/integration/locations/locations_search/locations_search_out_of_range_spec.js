import { oakleyLocationResponse } from '../../../fixtures/location_search_results';
import { stubLocationSearchResponse, checkDistanceOverlayDisplayed } from './helpers/location_search';

describe('Tests out of range location result cards', () => {
  let outOfRangeLocation;

  before(() => {
    outOfRangeLocation = oakleyLocationResponse();
    outOfRangeLocation.distance = 30.1;
    stubLocationSearchResponse([outOfRangeLocation]);
    
    cy.visit('/locations');

    const farAwayZip = '45209';
    cy.get('#search-input').clear().type(farAwayZip);
    cy.get('#input-search').click();
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