import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { SeriesQueryManager } from 'crds-cypress-contentful';

describe('Testing the Current Series on the Homepage:', function () {
  let currentSeries;
  before(function () {
    const sqm = new SeriesQueryManager();
    sqm.getSingleEntry(sqm.query.latestSeries).then(series => {
      currentSeries = series;
    });

  cy.ignorePropertyUndefinedTypeError();
  cy.on('uncaught:exception', (err, runnable) => {
      return false
  })
  cy.visit('/');

  });

  it('Current series title, description, and image should match Contentful', function () {
    cy.get('[data-automation-id="series-title"]').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('have.text', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', currentSeries.URL.relative);

    cy.get('[data-automation-id="series-description"]').as('seriesDescription');
    cy.get('@seriesDescription').normalizedText().then(elementText =>{
      expect(currentSeries.description.unformattedText).to.include(elementText);
    });

    cy.get('[data-automation-id="series-image"]').as('seriesImageLink');
    cy.get('@seriesImageLink').should('have.attr', 'href', currentSeries.URL.relative);
    cy.get('@seriesImageLink').find('img').as('seriesImage');

    currentSeries.imageLink.getResource().then(image => {
      new ImageDisplayValidator('seriesImage').shouldHaveImgixImage(image);
    });
  });

  it('"Watch Latest Service" button should link to the current series', function () {
    //Desktop version
    cy.get('[data-automation-id="watch-series-button"]').as('watchServiceButton');
    cy.get('@watchServiceButton').should('be.visible').and('have.attr', 'href', currentSeries.URL.relative);

    //Mobile version
    cy.get('[data-automation-id="mobile-watch-series-button"]').as('mobileWatchServiceButton');
    cy.get('@mobileWatchServiceButton').should('not.be.visible').and('have.attr', 'href', currentSeries.URL.relative);
  });
});
