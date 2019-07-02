import { ContentfulLibrary } from 'crds-cypress-tools';

describe('Testing the Current Series on the a locations page:', function () {
  let currentSeries;
  before(function () {
    const sqm = new ContentfulLibrary.queryManager.seriesQueryManager();
    sqm.fetchSingleEntry(sqm.query.latestSeries).then(series => {
      currentSeries = series;
    });
  });

  ['/dayton', '/oakley'].forEach(slug => {
    it(`On crossroads.net${slug}, the latest series button should link to the current series`, function () {
      cy.visit(slug);

      cy.get('[data-automation-id="series-slug"]').as('currentSeriesButton');
      cy.get('@currentSeriesButton').should('be.visible').and('have.attr', 'href', currentSeries.URL.relative);
    });
  });
});