import { SeriesQueryBuilder, normalizeText } from 'crds-cypress-contentful';

const errorsToIgnore = [/.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/];

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

        const start = currentSeries.starts_at ?
          Cypress.moment(currentSeries.starts_at.date).format('MM.DD.YYYY') : '';
        const end = currentSeries.ends_at ?
          Cypress.moment(currentSeries.ends_at.date).format('MM.DD.YYYY') : '';    
        cy.get('date').as('currentSeriesDateRange')
          .should('be.visible')
          .and('contain', `${start} — ${end}`);


        cy.get('div.col-xs-12.col-md-5 > div').as('currentSeriesDescription')
          .normalizedText()
          .should('contain', normalizeText(currentSeries.description.text));
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
