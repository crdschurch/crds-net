import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';
import { SeriesManager } from '../../Contentful/Models/SeriesModel';

describe('Testing the Current Series on the Homepage:', function () {
  let currentSeries;
  before(function () {
    const seriesManager = new SeriesManager();
    seriesManager.saveCurrentSeries();
    cy.wrap({ seriesManager }).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });
    cy.visit('/');
  });

  it('Current series title, description, and image should match Contentful', function () {
    cy.get('[data-automation-id="series-title"]').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('contain', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', currentSeries.absoluteUrl);

    cy.get('[data-automation-id="series-description"]').as('seriesDescription');
    Element.shouldMatchSubsetOfText('seriesDescription', currentSeries.description);

    cy.get('[data-automation-id="series-image"]').as('seriesImage');
    cy.get('@seriesImage').should('have.attr', 'href', currentSeries.absoluteUrl);

    Element.shouldHaveImgixImageFindImg('seriesImage', currentSeries.image);
  });

  it('"Watch Latest Service" button should link to the current series', function () {
    //Desktop version
    cy.get('[data-automation-id="watch-series-button"]').as('watchServiceButton');
    cy.get('@watchServiceButton').should('be.visible').and('have.attr', 'href', currentSeries.absoluteUrl);

    //Mobile version
    cy.get('[data-automation-id="mobile-watch-series-button"]').as('mobileWatchServiceButton');
    cy.get('@mobileWatchServiceButton').should('not.be.visible').and('have.attr', 'href', currentSeries.absoluteUrl);
  });
});
