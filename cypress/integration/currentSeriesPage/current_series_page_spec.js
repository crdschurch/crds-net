import { SeriesQueryBuilder } from 'crds-cypress-contentful';
const errorsToIgnore = [/.* > a.push is not a function*/,/.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/,  /.* > Cannot read property 'getAttribute' of null*/, /.* > Cannot set property 'status' of undefined*/];

describe('Tesing the Media/Series/[Current Series] page:', function () {
  let currentSeries;
  before(function () {
    const qb = new SeriesQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug,fields.image,fields.background_image';
    cy.task('getCNFLResource', qb.queryParams)
      .then((series) => {
        currentSeries = series;
        cy.ignoreMatchingErrors(errorsToIgnore);
        cy.visit(`/series/${currentSeries.slug.text}`);
      });
  });

  it('The jumbotron image and background image should match Contentful', function () {
    // Check current series image
    cy.get('.jumbotron-content').scrollIntoView().as('currentSeriesImage')
      .within(() => {
        cy.imgixShouldRunOnElement('img', currentSeries.image);
      });

    // Check Jumbotron background
    if (currentSeries.background_image && currentSeries.background_image.isPublished) {
      cy.get('.jumbotron')
        .should('be.visible')
        .should('have.attr', 'style')
        .and('contain', currentSeries.background_image.sys_id);
    } else if (currentSeries.image && currentSeries.image.isPublished) {
      cy.log(currentSeries.image.sys_id);
      cy.get('.jumbotron div')
        .should('have.attr', 'style')
        .and('contain', currentSeries.image.sys_id);
    }
  });
});

// TODO: remove this before merge. Just making a change so I can create a draft PR.