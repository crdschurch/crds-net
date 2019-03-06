import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';
import { SeriesManager } from '../../Contentful/Models/SeriesModel';

describe('Testing the Current Series on the Media landing page:', function () {
  let currentSeries;
  before(function () {
    const seriesManager = new SeriesManager();
    seriesManager.saveCurrentSeries();
    cy.wrap({ seriesManager }).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });
    cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}`);
  });

  beforeEach(function () {
    cy.get('[data-automation-id="series-section"]').as('featuredSeries').scrollIntoView();
  });

  it('The current series title, title link, and description should match Contentful', function () {
    cy.get('@featuredSeries').find('[data-automation-id="featured-title"]').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('contain', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', `/series/${currentSeries.slug.text}`);

    cy.get('@featuredSeries').find('[data-automation-id="featured-description"]').as('seriesDescription');
    Element.shouldMatchSubsetOfText('seriesDescription', currentSeries.description);
  });

  it('The current series image and image link should match Contentful', function () {
    cy.get('@featuredSeries').find('[data-automation-id="featured-image"]').as('seriesImage');
    cy.get('@seriesImage').should('have.attr', 'href', `/series/${currentSeries.slug.text}`);
    Element.shouldHaveImgixImageFindImg('seriesImage', currentSeries.image);
  });
});