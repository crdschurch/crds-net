import { ContentfulApi } from '../../Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';

describe('Testing the Current Series on the Live page:', function () {
  let currentSeries;
  before(function () {
    const content = new ContentfulApi();
    const seriesManager = content.retrieveSeriesManager();

    cy.wrap({seriesManager}).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });

    cy.visit('live');
  });

  //DO NOT RUN in open mode - Causes Cypress to hang
  it('Current Series title, date, and description should match Contentful', function () {
    cy.get('.current-series').as('currentSeriesBlock');

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-title"]').as('currentSeriesTitle');
    cy.get('@currentSeriesTitle').should('be.visible').and('contain', currentSeries.title.text);

    const start = currentSeries.startDate.ignoreTimeZone().toString();
    const end = currentSeries.endDate.ignoreTimeZone().toString();

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-dates"]').as('currentSeriesDateRange');
    cy.get('@currentSeriesDateRange').should('be.visible').and('contain', `${start} - ${end}`);

    cy.get('@currentSeriesBlock').find('[data-automation-id="series-description"]').as('currentSeriesDescription');
    Element.shouldContainText(cy.get('@currentSeriesDescription'), currentSeries.description);
  });

  it('Current Series image should match Contentful', function(){
    cy.get('[data-automation-id="series-image"]').as('currentSeriesImage');
    Element.shouldHaveImgixImage('currentSeriesImage', currentSeries.image);
  });

  it('"Watch Trailer" button should open a youtube modal, iff series has trailer', function () {
    //Test trailer button attributes
    if (!currentSeries.youtubeURL.hasContent){
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