import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';
import { SeriesManager } from '../../Contentful/Models/SeriesModel';

describe('Tesing the Media/Series/[Current Series] page:', function () {
  let currentSeries;
  before(function () {
    const seriesManager = new SeriesManager();
    seriesManager.saveCurrentSeries();
    cy.wrap({ seriesManager }).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
      cy.visit(currentSeries.absoluteUrl);
    });
  });

  it('The jumbotron image and background image should match Contentful', function () {
    //Current series image
    cy.get('.jumbotron-content').as('currentSeries');
    Element.shouldHaveImgixImageFindImg('currentSeries', currentSeries.image);

    //Large jumbotron image
    cy.get('.jumbotron').as('jumbotron');
    cy.get('@jumbotron').should('be.visible');

    if (currentSeries.backgroundImage.isRequiredOrHasContent) {
      cy.get('@jumbotron').should('have.attr', 'style').and('contain', currentSeries.backgroundImage.id);
    } else if (currentSeries.image.isRequiredOrHasContent) {
      cy.get('@jumbotron').find('div').should('have.attr', 'style').and('contain', currentSeries.image.id);
    }
  });
});