import { SeriesQueryBuilder, normalizeText } from 'crds-cypress-contentful';
const uncaughtExceptionError = /.*> Script error.*/;

describe.skip('Testing the Current Series on the Media landing page:', function () {

  let currentSeries;
  before(function () {
    const qb = new SeriesQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.slug,fields.description,fields.image';
    cy.task('getCNFLResource', qb.queryParams)
      .then((series) => {
        currentSeries = series;
      });
      cy.ignoreMatchingErrors([uncaughtExceptionError]);
    cy.visit('/media');
  });
  
  beforeEach(function () {
     cy.get('[data-automation-id="message-video"]').as('featuredSeries')
      .should('have.length', 1)
      .scrollIntoView();
  });

  it('The current series title, title link, and description should match Contentful', function () {
    cy.get('@featuredSeries').within(() => {
      cy.get('[data-automation-id="featured-title"]').as('seriesTitle')
        .should('be.visible')
        .and('have.text', currentSeries.title.text);
      cy.get('@seriesTitle')
        .should('have.attr', 'href', `/media/series/${currentSeries.slug.text}`);

      cy.get('[data-automation-id="featured-description"]').as('seriesDescription')
        .should('be.visible')
        .normalizedText()
        .then((elementText) => {
          expect(normalizeText(currentSeries.description.text)).to.contain(elementText);
        });
    });
  });

  it('The current series image and image link should match Contentful', function () {
    cy.get('@featuredSeries').scrollIntoView().within(() => {
      cy.get('[data-automation-id="featured-image"]').as('seriesImageLink')
        .should('have.attr', 'href', `/media/series/${currentSeries.slug.text}`);

      cy.imgixShouldRunOnElement('img', currentSeries.image);
    });
  });
});
