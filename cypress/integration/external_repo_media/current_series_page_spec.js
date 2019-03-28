import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { SeriesQueryManager } from '../../Contentful/QueryManagers/SeriesQueryManager';

describe('Tesing the Media/Series/[Current Series] page:', function () {
  let currentSeries;
  before(function () {
    const sqm = new SeriesQueryManager();
    sqm.fetchCurrentSeries().then(() => {
      currentSeries = sqm.queryResult;
      cy.visit(currentSeries.URL.absolute);
      currentSeries.fetchLinkedResources();
    });
  });

  it('The jumbotron image and background image should match Contentful', function () {
    //Large jumbotron image
    cy.get('.jumbotron').as('jumbotron');
    cy.get('@jumbotron').should('be.visible');

    //TODO does this work if the image is unpublished?
    if(currentSeries.backgroundImage !== undefined){
      cy.get('@jumbotron').should('have.attr', 'style').and('contain', currentSeries.backgroundImage.id);
    } else if(currentSeries.image !== undefined) {
      cy.get('@jumbotron').find('div').should('have.attr', 'style').and('contain', currentSeries.image.id);
    }

    //Current series image
    cy.get('.jumbotron-content').find('img').as('currentSeriesImage');
    cy.get('@currentSeriesImage').should('be.visible');
    new ImageDisplayValidator('currentSeriesImage').shouldHaveImgixImage(currentSeries.image);
  });
});