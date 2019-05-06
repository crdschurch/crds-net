import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { SeriesQueryManager } from '../../Contentful/QueryManagers/SeriesQueryManager';

function formattedDate(date) {
  if (date === undefined)
    return '';
  return Cypress.moment(date).format('MM.DD.YYYY');
}

describe('Testing the Current Series on the Live page:', function () {
  let currentSeries;
  before(function () {
    const sqm = new SeriesQueryManager();
    sqm.fetchCurrentSeries().then(() => {
      currentSeries = sqm.queryResult;
      currentSeries.fetchLinkedResources();
    });

    cy.visit('/live');
  });

  //DO NOT RUN in open mode - Causes Cypress to hang
  it('Current Series title, date, and description should match Contentful', function () {
    cy.get('.current-series').as('currentSeriesBlock');

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-title"]').as('currentSeriesTitle');
    cy.get('@currentSeriesTitle').should('be.visible').and('have.text', currentSeries.title.text);

    const start = currentSeries.startDate.hasValue ?
      Cypress.moment(currentSeries.startDate.date).format('MM.DD.YYYY') : '';
    const end = currentSeries.endDate.hasValue ?
      Cypress.moment(currentSeries.endDate.date).format('MM.DD.YYYY') : '';

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-dates"]').as('currentSeriesDateRange');
    cy.get('@currentSeriesDateRange').should('be.visible').and('contain', `${start} - ${end}`);

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-description"]').as('currentSeriesDescription');
    cy.get('@currentSeriesDescription').normalizedText().should('contain', currentSeries.description.displayedText);
  });

  it('Current Series image should match Contentful', function () {
    cy.get('[data-automation-id="series-image"]').as('currentSeriesImage');
    new ImageDisplayValidator('currentSeriesImage').shouldHaveImgixImage(currentSeries.image);
  });

  it('"Watch Trailer" button should open a youtube modal, iff series has trailer', function () {
    //Test trailer button attributes
    if (currentSeries.youtubeURL === undefined) {
      cy.get('[data-automation-id="series-youtube"]').should('not.exist');
    } else {
      cy.get('[data-automation-id="series-youtube"]').as('trailerButton');
      cy.get('@trailerButton').should('be.visible').and('have.attr', 'href', currentSeries.youtubeURL.text);
      cy.get('@trailerButton').should('have.attr', 'data-toggle', 'modal');
      cy.get('@trailerButton').should('have.attr', 'data-target', '#trailer-video-modal');
    }

    //Test modal attributes
    cy.get('#trailer-video-modal').find('#modal-video-src').as('youtubeModal');
    cy.get('@youtubeModal').should('exist');
    cy.get('@youtubeModal').should('have.attr', 'data-src', currentSeries.youtubeURL.text);
  });
});