import { ContentfulApi } from '../../Contentful/ContentfulApi';

describe('Testing the Current Series in the Shared Header/Media dropdown:', function () {
  let currentSeries;
  before(function () {
    const content = new ContentfulApi();
    const seriesManager = content.retrieveSeriesManager();

    cy.wrap({ seriesManager }).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });

    cy.visit('/');
    cy.get('a[data-automation-id="sh-media"]').click();
  });


  it.skip('The Current Series image and link should match Contentful (if not, update the media-snippets)', function () {
    cy.get('li[data-automation-id="sh-currentseries"]').as('currentSeriesImage');
    cy.get('@currentSeriesImage').should('be.visible');

    //Skip in demo - shared header content may be from prod
    if (!Cypress.env('CRDS_MEDIA_ENDPOINT').includes('demo')) {
      cy.get('@currentSeriesImage').find('a').should('have.attr', 'href').and('contain', currentSeries.slug.text);

      if (currentSeries.image.isRequiredOrHasContent) {
        cy.get('@currentSeriesImage').find('img').should('have.attr', 'src').and('contain', currentSeries.image.id);
      }
    }
  });
});
