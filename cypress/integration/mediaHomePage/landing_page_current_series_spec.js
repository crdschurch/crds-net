import { SeriesQueryBuilder } from 'crds-cypress-contentful';

const errorsToIgnore = [/.*> Cannot read property 'attributes' of undefined*/, /.* > a.push is not a function*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > errorList.find is not a function*/, /.* > Cannot set property 'status' of undefined*/];

describe.skip('Testing the Current Series on the Media landing page:', function () {
  //This test is for queries 
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
    cy.clearLocalStorage();
    cy.visit('/');
  });

  beforeEach(function () {
    cy.get('data-automation-id="live-message').as('featuredSeries')
      .should('have.length', 1)
      .scrollIntoView();
  });

  it('The current series title, title link, and description should match Contentful', function () {
    cy.get('@featuredSeries').within(() => {
      cy.get('[data-automation-id="message-title"]').as('seriesTitle')
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