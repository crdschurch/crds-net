import { stubLocationSearchResponse } from './helpers/location_search';
import { searchErrorResponse } from '../../../fixtures/location_search_results';

const errorsToIgnore = [/.* > a.push is not a function*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > errorList.find is not a function*/, /.* > Cannot set property 'status' of undefined*/, /.*Cannot read property 'getAttribute' of null*/];

describe('Tests invalid search', function() {
  it('Checks error is displayed', function() {
    // Setup search response error
    const errorResponse = searchErrorResponse();
    stubLocationSearchResponse(errorResponse, 400);
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('/locations');

    const keyword = 'ljs;oifjoeia';
    cy.get('#search-input').clear().type(keyword);
    cy.get('#input-search').click();

    cy.get('[data-automation-id="locations-carousel"] .error-text').as('searchError')
      .should('be.visible');
  });
});