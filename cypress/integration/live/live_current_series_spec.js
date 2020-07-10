import { SeriesQueryBuilder, normalizeText } from 'crds-cypress-contentful';

describe('Testing the Current Series on the Live page:', () => {
  let currentSeries;
  before(() => {
    const qb = new SeriesQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.description,fields.image,fields.starts_at,fields.ends_at,fields.youtube_url';
    qb.limit = 1;
    cy.task('getCNFLResource', qb.queryParams)
      .then((series) =>{
        currentSeries = series;
      });

    cy.visit('/live');
  });

  it('Current Series title, date, and description should match Contentful', () => {
    cy.get('.current-series').as('currentSeriesBlock');

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-title"]').as('currentSeriesTitle');
    cy.get('@currentSeriesTitle').should('be.visible').and('have.text', currentSeries.title.text);

    const start = currentSeries.starts_at ?
      Cypress.moment(currentSeries.starts_at.date).format('MM.DD.YYYY') : '';
    const end = currentSeries.ends_at && currentSeries.ends_at ?
      Cypress.moment(currentSeries.ends_at.date).format('MM.DD.YYYY') : '';

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-dates"]').as('currentSeriesDateRange');
    cy.get('@currentSeriesDateRange').should('be.visible').and('contain', `${start} - ${end}`);

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-description"]').as('currentSeriesDescription');
    cy.get('@currentSeriesDescription').normalizedText().should('contain', normalizeText(currentSeries.description.text));
  });

  it('Current Series image should match Contentful', () => {
    cy.imgixShouldRunOnElement('[data-automation-id="series-image"]', currentSeries.image);
  });

  it('"Watch Trailer" button should open a youtube modal, iff series has trailer', () => {
    //Test trailer button attributes
    if (!currentSeries.youtube_url) {
      cy.get('[data-automation-id="series-youtube"]').should('not.exist');
    } else {
      cy.get('[data-automation-id="series-youtube"]').as('trailerButton');
      cy.get('@trailerButton').should('be.visible').and('have.attr', 'href', currentSeries.youtube_url.text);
      cy.get('@trailerButton').should('have.attr', 'data-toggle', 'modal');
      cy.get('@trailerButton').should('have.attr', 'data-target', '#trailer-video-modal');
    }

    //Test modal attributes
    cy.get('#trailer-video-modal').find('#modal-video-src').as('youtubeModal');
    cy.get('@youtubeModal').should('exist');
    cy.get('@youtubeModal').should('have.attr', 'data-src', currentSeries.youtube_url && currentSeries.youtube_url.text || '');
  });
});