import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { SeriesQueryManager } from '../../Contentful/QueryManagers/SeriesQueryManager';

describe('Testing the Current Series on the Homepage:', function () {
  let currentSeries;
  before(function () {
    const sqm = new SeriesQueryManager();
    sqm.fetchCurrentSeries().then((results) => {
      currentSeries = results;
      currentSeries.fetchLinkedResources();
    });

    cy.ignoreUncaughtException('Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/');
  });

  it('Current series title, description, and image should match Contentful', function () {
    cy.get('[data-automation-id="series-title"]').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('have.text', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', currentSeries.URL.relative);

    cy.get('[data-automation-id="series-description"]').as('seriesDescription');
    cy.get('@seriesDescription').normalizedText().then(elementText =>{
      expect(currentSeries.description.displayedText).to.include(elementText);
    });

    cy.get('[data-automation-id="series-image"]').as('seriesImageLink');
    cy.get('@seriesImageLink').should('have.attr', 'href', currentSeries.URL.relative);
    cy.get('@seriesImageLink').find('img').as('seriesImage');
    new ImageDisplayValidator('seriesImage').shouldHaveImgixImage(currentSeries.image);
  });

  it('"Watch Latest Service" button should link to the current series', function () {
    //Desktop version
    cy.get('[data-automation-id="watch-series-button"]').as('watchServiceButton');
    cy.get('@watchServiceButton').should('be.visible').and('have.attr', 'href', currentSeries.URL.absolute);

    //Mobile version
    cy.get('[data-automation-id="mobile-watch-series-button"]').as('mobileWatchServiceButton');
    cy.get('@mobileWatchServiceButton').should('not.be.visible').and('have.attr', 'href', currentSeries.URL.absolute);
  });
});
