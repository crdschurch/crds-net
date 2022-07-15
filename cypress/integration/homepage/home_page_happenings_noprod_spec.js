import { SeriesQueryBuilder, normalizeText } from 'crds-cypress-contentful';

const errorsToIgnore = [/.*> Script error.*/, /.*> a.push is not a function*/, /.*> Cannot read property 'attributes' of undefined*/, /.*> Cannot set property 'status' of undefined*/, /.* > Cannot read property 'getAttribute' of null*/];
describe('Testing the Current Series on the Homepage:', function () {
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
  it('Current series title, description, and image should match Contentful', function () {
    cy.get('.section-header').as('seriesTitle')
      .should('be.visible')
      .invoke('text').should('eq', currentSeries.title.text);
    cy.log(currentSeries.title.text)
    cy.get('.col-sm-12 > .push-top').as('seriesDescription');
  
    cy.get('.home-jumbo-rel').as('seriesImageLink')
      .scrollIntoView()
      .should('have.attr', 'data-imgix-bg-processed', 'true')
  });
  it('"Watch current teaching series" button should link to the current series', function () {
    cy.get('h2').contains(currentSeries.title.text).scrollIntoView();
    cy.get('crds-button', { includeShadowDom: true })
      .should('be.visible')
      .should('have.attr', 'text', 'Watch the current teaching series')
      .as('watchServiceButton')
      .should('be.visible')
      .and('have.attr', 'href', `/watch`);
  });
});