import { SeriesQueryBuilder, normalizeText} from 'crds-cypress-contentful';

const dayjs = require('dayjs');
const errorsToIgnore = [/.* > a.push is not a function*/,/.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/,  /.* > Cannot read property 'getAttribute' of null*/, /.* > Cannot set property 'status' of undefined*/, /.* > TypeError: Cypress.moment is not a function*/];

describe('Testing the Current Series on the Media/Series page:', function () {
  let currentSeries;
  before(function () {
    const qb = new SeriesQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.slug,fields.description,fields.image,fields.starts_at,fields.ends_at';
    cy.task('getCNFLResource', qb.queryParams)
      .then(series => {
        currentSeries = series;
      });
    cy.ignoreMatchingErrors(errorsToIgnore);  
    cy.visit('/series');
  });

  it('The Current series title, date range, and description should match Contentful', function () {
    cy.get('.current-series').as('currentSeriesBlock')
      .within(() => {
        cy.get('h1').as('currentSeriesTitle')
          .should('be.visible')
          .and('have.text', currentSeries.title.text);
    
        const start = dayjs(currentSeries.starts_at.date).format('MM.DD.YYYY');
        const end = dayjs(currentSeries.ends_at.date).format('MM.DD.YYYY');    
        cy.get('date').as('currentSeriesDateRange')
          .should('be.visible')
          .and('contain', `${start} — ${end}`);


        cy.get('div.col-xs-12.col-md-5 > a').as('viewSeriesButton')
          .should('be.visible')
          .and('contain','View the series');
      });
  });

  it('The current series image and image link should match Contentful', function () {
    cy.get('.current-series a').first().scrollIntoView().as('currentSeries')
      .should('have.attr', 'href', `/media/series/${currentSeries.slug.text}`)
      .within(() => {
        cy.imgixShouldRunOnElement('img', currentSeries.image);
      });
  });

  it('"View the series" button should link to the current series', function () {
    cy.contains('View the series').as('viewSeriesButton')
      .should('be.visible')
      .and('have.attr', 'href', `/media/series/${currentSeries.slug.text}`);
  });
});