import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { SeriesQueryManager } from '../../Contentful/QueryManagers/SeriesQueryManager';

describe('Testing the Current Series on the Media landing page:', function () {
  let currentSeries;
  before(function () {
    const sqm = new SeriesQueryManager();
    sqm.fetchCurrentSeries().then(() => {
      currentSeries = sqm.queryResult;
      currentSeries.fetchLinkedResources();
    });

    cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}`);
  });

  beforeEach(function () {
    cy.get('[data-automation-id="series-section"]').as('featuredSeries').should('have.length', 1);
    cy.get('@featuredSeries').scrollIntoView();
  });

  it('The current series title, title link, and description should match Contentful', function () {
    cy.get('@featuredSeries').find('[data-automation-id="featured-title"]').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('have.text', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', `/media${currentSeries.URL.relative}`);

    cy.get('@featuredSeries').find('[data-automation-id="featured-description"]').as('seriesDescription');
    cy.get('@seriesDescription').should('be.visible').normalizedText().then(elementText =>{
      expect(currentSeries.description.displayedText).to.contain(elementText);
    });
  });

  it('The current series image and image link should match Contentful', function () {
    cy.get('@featuredSeries').find('[data-automation-id="featured-image"]').as('seriesImageLink');
    cy.get('@seriesImageLink').should('have.attr', 'href', `/media${currentSeries.URL.relative}`);

    cy.get('@seriesImageLink').find('img').as('seriesImage');
    new ImageDisplayValidator('seriesImage').shouldHaveImgixImage(currentSeries.image);
  });
});
