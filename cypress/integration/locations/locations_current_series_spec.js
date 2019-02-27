import { SeriesManager } from '../../Contentful/Models/SeriesModel';

describe('Testing the Current Series on the /dayton page:', function () {
  let currentSeries;
  before(function () {
    const seriesManager = new SeriesManager();
    seriesManager.saveCurrentSeries();
    cy.wrap({ seriesManager }).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });

    cy.visit('/dayton');
  });

  it('Check out latest series button should link to the current series', function () {
    cy.get('[data-automation-id="series-slug"]').as('currentSeriesButton');
    cy.get('@currentSeriesButton').should('be.visible').and('have.attr', 'href', `/series/${currentSeries.slug.text}`);
  });
});