import { oakleyLocationResponse } from '../../../fixtures/location_search_results';
import { stubLocationSearchResponse } from './helpers/location_search';

const errorsToIgnore = [/.*> Cannot convert undefined or null to object*/,/.* > a.push is not a function*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > errorList.find is not a function*/, /.* > Cannot set property 'status' of undefined*/];

describe('Tests out of range location result cards', function() {
  const outOfRangeLocation = oakleyLocationResponse();
  outOfRangeLocation.distance = 30.1;

  before(function() {
    stubLocationSearchResponse([outOfRangeLocation]);  
    cy.ignoreMatchingErrors(errorsToIgnore);  
    cy.visit('/locations');

    const farAwayZip = '45209';
    cy.get('#search-input').clear().type(farAwayZip);
    cy.get('#input-search').click();
  });

  it('Checks Anywhere card displayed first without distance overlay', function() {
    cy.get('#section-locations .card').first().as('firstCard')
      .should('not.have.attr', 'data-distance'); 
    
    cy.get('@firstCard').within(() => {
      cy.get('[data-automation-id="location-name"]')
        .invoke('text').should('eq', 'Anywhere');
      cy.get('[data-automation-id="location-name"]')
        .should('have.attr', 'href', '/anywhere');
    });
  });

  it('Checks out of range location card displayed second with distance overlay', function() {
    cy.get('#section-locations .card').first().next().as('secondCard')
      .should('have.attr', 'data-distance', outOfRangeLocation.distance.toString());

    cy.get('@secondCard').within(() => {
      cy.get('[data-automation-id="location-name"]')
        .invoke('text').should('eq', outOfRangeLocation.location.location);

      cy.get('.distance').should('contain', 'miles');
    });
  });
});