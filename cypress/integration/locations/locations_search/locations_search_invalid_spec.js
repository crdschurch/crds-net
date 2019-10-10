import { stubLocationSearch, visitLocationsAndSearch } from './location_search_helpers';

//Warning! - The locations page sometimes loads with missing functionality. Issue captured DE6665
describe('Tests invalid search', () => {
  before(function () {
    const response = {
      'message': 'LocationController: GET locations proximities -- ',
      'errors': [
        'Exception of type \'crds_angular.Exceptions.InvalidAddressException\' was thrown.'
      ]
    };
    stubLocationSearch(response, 400);

    const keyword = 'ljs;oifjoeia';
    visitLocationsAndSearch(keyword);
  });

  it('Checks error is displayed', () => {
    cy.get('[data-automation-id="locations-carousel"] > .error-text').as('searchError').should('be.visible');
  });
});