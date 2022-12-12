import { SeriesQueryBuilder} from 'crds-cypress-contentful';

const errorsToIgnore = [/.*> Script error.*/, /.* > a.push is not a function*/, /.*> Cannot read property 'attributes' of undefined*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > errorList.find is not a function*/, /.* > Cannot set property 'status' of undefined*/];
describe('Testing the Current Series on the Homepage:', function() {
  let currentSeries;
  before(function() {
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
 
  it('Current series title, description, and image should match Contentful', function() {
    cy.get('.section-header').as('seriesTitle')
      .should('be.visible')
      .invoke('text').should('eq', currentSeries.title.text);
    cy.get('@seriesTitle')
      .should('have.attr', 'class', `section-header flush-ends text-white`);
    cy.get('crds-button', { includeShadowDom: true })
      .should('be.visible')
      .should('have.attr', 'text', 'Watch the current teaching series')
      .as('watchServiceButton')
      .should('be.visible')
      .and('have.attr', 'href', `/watch`);
  });
  it('"Watch current teaching series" button should link to the current series', function() {
    cy.get('[href="/watch"]')
      .as('watchServiceButton')
      .should('be.visible');
  });
});