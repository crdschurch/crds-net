import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../support/Cypress/ContentfulElementValidator';

describe('Tesing the Media/Series/[Current Series] page:', function(){
    let currentSeries;
    before(function() {
        const seriesList = new ContentfulApi().retrieveSeriesManager();

        //Wait for response before navigating
        cy.wrap({seriesList}).its('seriesList.currentSeries').should('not.be.undefined').then(() => {
            currentSeries = seriesList.currentSeries;
            cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug.text}`);
        });
    });

    it('The jumbotron image and background image should match Contentful', function() {
        cy.get('.jumbotron').as('jumbotron');

        //Current series image
        cy.get('@jumbotron').find('img').as('currentSeriesImage');
        cy.get('@currentSeriesImage').should('be.visible');
        Element.shouldHaveImgixImage(cy.get('@currentSeriesImage'), currentSeries.image);

        //Large jumbotron image
        cy.get('@jumbotron').should('be.visible');
        cy.get('@jumbotron').then(($jumbotronBackground) => {
            if(currentSeries.backgroundImage.isRequiredOrHasContent){
                expect($jumbotronBackground).to.have.attr('style').contains(currentSeries.backgroundImage.id);
            } else if (currentSeries.image.isRequiredOrHasContent){
                expect($jumbotronBackground.find('div')).to.have.attr('style').contains(currentSeries.imageId);
            }
        });
    });
});