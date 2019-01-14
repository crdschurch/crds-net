import { ContentfulApi } from '../../Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';

describe('Testing the Current Series on the Homepage:', function () {
  let currentSeries;
  before(function () {
    const content = new ContentfulApi();
    const seriesManager = content.retrieveSeriesManager();

    cy.wrap({seriesManager}).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });

    cy.visit('/');
  });

  it('Current series title, description, and image should match Contentful', function(){
    const seriesLink = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug.text}`;

    cy.get('[data-automation-id="series-title"]').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('contain', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', seriesLink);

    cy.get('[data-automation-id="series-description"]').as('seriesDescription');
    Element.shouldMatchSubsetOfText(cy.get('@seriesDescription'), currentSeries.description);

    cy.get('[data-automation-id="series-image"]').as('seriesImage');
    cy.get('@seriesImage').should('have.attr', 'href', seriesLink);

    Element.shouldHaveImgixImageFindImg('seriesImage', currentSeries.image);
  });

  it.skip('"Watch Latest Service" button should link to the current series', function(){
    const seriesLink = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug.text}`;

    //Desktop version
    cy.get('[data-automation-id="watch-series-button"]').as('watchServiceButton');
    cy.get('@watchServiceButton').should('be.visible').and('have.attr', 'href', seriesLink);

    //Mobile version
    cy.get('[data-automation-id="mobile-watch-series-button"]').as('mobileWatchServiceButton');
    cy.get('@mobileWatchServiceButton').should('not.be.visible').and('have.attr', 'href', seriesLink);
  });
});
