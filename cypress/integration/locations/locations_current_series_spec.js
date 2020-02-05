import { SeriesQueryManager } from 'crds-cypress-contentful';

describe('Testing the Current Series on the a locations page:', function () {
  let currentSeries;
  before(function () {
      const sqm = new SeriesQueryManager();
      cy.on('uncaught:exception', (err, runnable) => {
          return false
      }) 
    sqm.getSingleEntry(sqm.query.latestSeries).then(series => {
      currentSeries = series;
    });
  });

  ['/dayton', '/oakley'].forEach(slug => {
      it(`On crossroads.net${slug}, the latest series button should link to the current series`, function () {
      const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/, /.*Cannot set property staus of undefined.*/, /.*Bit movin is undefined.*/];
      cy.ignoreMatchingErrors(errorsToIgnore);
      cy.visit(slug);
      cy.get('[data-automation-id="series-slug"]').as('currentSeriesButton');

      cy.get('@currentSeriesButton').should('be.visible').and('have.attr', 'href', currentSeries.URL.relative);
    });
  });
});