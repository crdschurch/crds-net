import { SeriesQueryBuilder, normalizeText } from 'crds-cypress-contentful';

const errorsToIgnore =  /.* > Cannot read property 'getAttribute' of null*/;


describe('Testing the Current Series on the Media landing page:', function () {
 
  let currentSeries;
  before(function () {
    const qb = new SeriesQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.slug,fields.description,fields.image';
    cy.task('getCNFLResource', qb.queryParams)
      .then((series) => {
        currentSeries = series;
      });
      cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('/');
  });

  beforeEach(function () {
    cy.get('div.media-body').as('featuredSeries')
      .should('have.length', 1)
      .scrollIntoView();
  });

  it('The current series title, title link, and description should match Contentful', function () {
      cy.get('@featuredSeries').within(() => {
      cy.get('[data-automation-id="series-title"]').as('seriesTitle')
        .should('be.visible')
        .and('have.text', currentSeries.title.text);
      cy.get('@seriesTitle')
        .should('have.attr', 'href', `/media/series/${currentSeries.slug.text}`);
       
      cy.get('crds-button', { includeShadowDom: true })
        .should('be.visible')
        .should('have.attr', 'text', 'Watch the current teaching series');
      });
  });

  it('The current series image and image link should match Contentful', function () {
    cy.get('.media').scrollIntoView().within(() => {
      cy.get('[data-automation-id="series-image"]').as('seriesImageLink')
        .should('have.attr', 'href', `/media/series/${currentSeries.slug.text}`);
     cy.imgixShouldRunOnElement('img', currentSeries.image);
    });
  });
});