import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { SeriesQueryManager } from 'crds-cypress-contentful';

describe('Testing the Current Series on the Homepage:', () => {
  let currentSeries;
  before(() => {
    const sqm = new SeriesQueryManager();
    sqm.getSingleEntry(sqm.query.latestSeries).then(series => {
      currentSeries = series;
    });

    cy.visit('/');
  });

  it('Current series title, description, and image should match Contentful', () => {
    cy.get('[data-automation-id="series-title"]').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('have.text', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', currentSeries.URL.relative);

    cy.get('[data-automation-id="series-description"]').as('seriesDescription');
    cy.get('@seriesDescription').normalizedText().then(elementText => {
      expect(currentSeries.description.unformattedText).to.include(elementText);
    });

    cy.get('[data-automation-id="series-image"]').as('seriesImageLink');
    cy.get('@seriesImageLink').should('have.attr', 'href', currentSeries.URL.relative);
    cy.get('@seriesImageLink').find('img').as('seriesImage');

    currentSeries.imageLink.getResource().then(image => {
      new ImageDisplayValidator('seriesImage').shouldHaveImgixImage(image);
    });
  });

  //TODO fix this - may need later versions with shadow dom support
  it.skip('"Watch Latest Service" button should link to the current series', () => {
    //Desktop version
    // cy.get('[data-automation-id="watch-series-button"]')
    cy.get('crds-button').contains('Watch the current teaching series')
      .as('watchServiceButton');
    cy.get('@watchServiceButton').should('be.visible').and('have.attr', 'href', currentSeries.URL.relative);

    //Mobile version
    // cy.get('[data-automation-id="mobile-watch-series-button"]').as('mobileWatchServiceButton');
    // cy.get('@mobileWatchServiceButton').should('not.be.visible').and('have.attr', 'href', currentSeries.URL.relative);
  });
});
