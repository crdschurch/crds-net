import { ContentfulApi } from '../../Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';


describe('Testing the Current Series on the Media landing page:', function(){
  let currentSeries;
  before(function() {
    const content = new ContentfulApi();
    const seriesList = content.retrieveSeriesManager();

    cy.wrap({seriesList}).its('seriesList.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesList.currentSeries;
      cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/`);
    });
  });

  it('The current series title, title link, and description should match Contentful', function(){
    cy.contains('series').parent().find('.featured > .media-body').as('seriesContent');

    cy.get('@seriesContent').find('.component-header > a').as('seriesTitle');
    cy.get('@seriesTitle').should('be.visible').and('contain', currentSeries.title.text);
    cy.get('@seriesTitle').should('have.attr', 'href', `/series/${currentSeries.slug.text}`);

    Element.shouldMatchSubsetOfText(cy.get('@seriesContent').find('div'), currentSeries.description);
  });

  it('The current series image and image link should match Contentful', function(){
    cy.contains('series').parent().find('.featured > a').find('img').as('seriesImage');

    cy.get('@seriesImage').parent().should('have.attr', 'href', `/series/${currentSeries.slug.text}`);
    Element.shouldHaveImgixImage('seriesImage', currentSeries.image);
  });
});
