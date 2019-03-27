import { ImageDisplayValidator } from '../../Contentful/ContentfulElementValidator';
import { SeriesQueryManager } from '../../Contentful/QueryManagers/SeriesQueryManager';

describe('Tesing the Current Series on the Media/Series page:', function () {
  let currentSeries;
  before(function () {
    const sqm = new SeriesQueryManager();
    sqm.fetchCurrentSeries().then(() => {
      currentSeries = sqm.queryResult;
      currentSeries.fetchLinkedResources();
    });

    cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series`);
  });

  it('The Current series title, date range, and description should match Contentful', function () {
    cy.get('.current-series').as('currentSeriesBlock');

    cy.get('@currentSeriesBlock').find('h1').as('currentSeriesTitle');
    cy.get('@currentSeriesTitle').should('be.visible').and('have.text', currentSeries.title.text);

    const start = Cypress.moment(currentSeries.startDate.date).format('MM.DD.YYYY');
    const end = Cypress.moment(currentSeries.endDate.date).format('MM.DD.YYYY');

    cy.get('@currentSeriesBlock').find('date').as('currentSeriesDateRange');
    cy.get('@currentSeriesDateRange').should('be.visible').and('contain', `${start} — ${end}`);

    cy.get('@currentSeriesBlock').find('div.col-xs-12.col-md-5 > div').as('currentSeriesDescription');
    cy.get('@currentSeriesDescription').normalizedText().should('contain', currentSeries.description.displayedText);
  });

  it('The current series image and image link should match Contentful', function () {
    cy.get('.current-series').as('currentSeries');
    cy.get('@currentSeries').find('a').should('have.attr', 'href', `/media${currentSeries.URL.relative}`);
    cy.get('@currentSeries').find('img').as('currentSeriesImage');
    new ImageDisplayValidator('currentSeriesImage').shouldHaveImgixImage(currentSeries.image);
  });

  it('"View the series" button should link to the current series', function () {
    cy.contains('View the series').as('viewSeriesButton');
    cy.get('@viewSeriesButton').should('be.visible').and('have.attr', 'href', `/media${currentSeries.URL.relative}`);
  });
});
