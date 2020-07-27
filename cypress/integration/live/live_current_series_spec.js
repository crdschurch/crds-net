import { SeriesQueryBuilder, normalizeText } from 'crds-cypress-contentful';

describe('Testing the Current Series on the Live page:', function() {
  let currentSeries;
  before(function() {
    const qb = new SeriesQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.description,fields.image,fields.starts_at,fields.ends_at,fields.youtube_url';
    cy.task('getCNFLResource', qb.queryParams)
      .then((series) =>{
        currentSeries = series;
      });

    cy.visit('/live');
  });

  it('Current Series title, date, and description should match Contentful', function() {
    cy.get('.current-series').as('currentSeriesBlock').within(() => {
      cy.get('[data-automation-id="series-title"]').as('currentSeriesTitle')
        .should('be.visible').and('have.text', currentSeries.title.text);

      const start = currentSeries.starts_at ?
        Cypress.moment(currentSeries.starts_at.date).format('MM.DD.YYYY') : '';
      const end = currentSeries.ends_at && currentSeries.ends_at ?
        Cypress.moment(currentSeries.ends_at.date).format('MM.DD.YYYY') : '';
      cy.get('[data-automation-id="series-dates"]').as('currentSeriesDateRange')
        .should('be.visible').and('contain', `${start} - ${end}`);

      cy.get('[data-automation-id="series-description"]').as('currentSeriesDescription')
        .normalizedText()
        .should('contain', normalizeText(currentSeries.description.text));
    });
  });

  it('Current Series image should match Contentful', function() {
    cy.get('[data-automation-id="series-image"]')
      .scrollIntoView()
      .then(() => {
        cy.imgixShouldRunOnElement('[data-automation-id="series-image"]', currentSeries.image);
      });
  });

  it('"Watch Trailer" button should open a youtube modal, iff series has trailer', function() {
    if (!currentSeries.youtube_url) {
      cy.get('[data-automation-id="series-youtube"]')
        .should('not.exist');

      cy.get('#trailer-video-modal #modal-video-src').as('youtubeModal')
        .should('exist')
        .and('have.attr', 'data-src', '');
    } else {
      cy.get('[data-automation-id="series-youtube"]').as('trailerButton')
        .should('be.visible')
        .and('have.attr', 'href', currentSeries.youtube_url.text);
      cy.get('@trailerButton').should('have.attr', 'data-toggle', 'modal');
      cy.get('@trailerButton').should('have.attr', 'data-target', '#trailer-video-modal');

      cy.get('#trailer-video-modal #modal-video-src').as('youtubeModal')
        .should('exist')
        .and('have.attr', 'data-src', currentSeries.youtube_url.text);
    }
  });
});