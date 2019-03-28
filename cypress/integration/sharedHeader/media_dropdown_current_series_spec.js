import { SeriesQueryManager } from '../../Contentful/QueryManagers/SeriesQueryManager';
import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';

describe('Testing the Current Series in the Shared Header/Media dropdown:', function () {
  let currentSeries;
  before(function () {
    const sqm = new SeriesQueryManager();
    sqm.fetchCurrentSeries().then(() => {
      currentSeries = sqm.queryResult;
      currentSeries.fetchLinkedResources();
    });

    cy.ignoreUncaughtException('Uncaught TypeError: Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/');

    cy.get('a[data-automation-id="sh-media"]').click();
  });

  it('The Current Series image and link should match Contentful (if not, update the media-snippets)', function () {
    cy.get('li[data-automation-id="sh-currentseries"]').as('currentSeries');
    cy.get('@currentSeries').should('be.visible');
    cy.get('@currentSeries').find('a').should('have.attr', 'href', currentSeries.URL.absolute);

    //TODO doe this have placeholder image? is method correct?
    cy.get('@currentSeries').find('img').as('currentSeriesImage');
    new ImageDisplayValidator('currentSeriesImage').shouldHaveImage(currentSeries.image);
  });
});
