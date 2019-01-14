import { ContentfulApi } from '../../Contentful/ContentfulApi';

describe('Testing the Current Series on a random Locations page:', function () {
  let currentSeries;
  let locations;
  before(function () {
    const content = new ContentfulApi();
    const seriesManager = content.retrieveSeriesManager();
    locations = content.retrieveLocationList();

    cy.wrap({seriesManager}).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });

    cy.wrap({locations}).its('locations.locationCount').should('not.be.undefined').then(() => {
      assert.isAbove(locations.locationCount, 0, 'Sanity check: At least one location is served from Contentful');
    });
  });

  it('Check out latest series button should link to the current series', function() {
    cy.visit(locations.getSomeLocation.slug.text);

    cy.get('[data-automation-id="series-slug"]').as('currentSeriesButton');
    cy.get('@currentSeriesButton').should('be.visible').and('have.attr', 'href', `/series/${currentSeries.slug.text}`);
  });
});