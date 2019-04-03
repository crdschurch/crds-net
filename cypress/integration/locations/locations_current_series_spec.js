import { SeriesQueryManager } from '../../Contentful/QueryManagers/SeriesQueryManager';

describe('Testing the Current Series on the /dayton page:', function () {
  it('Check out latest series button should link to the current series', function () {
    cy.visit('/dayton');

    const sqm = new SeriesQueryManager();
    sqm.fetchCurrentSeries().then(() => {
      const currentSeries = sqm.queryResult;

      cy.get('[data-automation-id="series-slug"]').as('currentSeriesButton');
      cy.get('@currentSeriesButton').should('be.visible').and('have.attr', 'href', currentSeries.URL.relative);
    });
  });
});