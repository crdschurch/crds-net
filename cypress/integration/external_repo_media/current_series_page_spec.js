import {ContentfulApi} from '../../support/Contentful/ContentfulApi';

describe("Tesing the Media/Series/[Current Series] page", function(){
    let currentSeries;
    before(function() {
        currentSeries = new ContentfulApi().retrieveCurrentSeries();

        //Wait for response before navigating
        cy.wrap({currentSeries}).its('currentSeries.slug').should('not.be.undefined').then(() => {
            cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}`);
        })
    })

    it('Tests the image and background image match their entries in Contentful', function() {
        cy.get('.jumbotron').find('img').then(($jumbotronForeground) => {
            expect($jumbotronForeground).to.be.visible;
            expect($jumbotronForeground).to.have.attr('srcset'); //If fails, image was not found

            if (currentSeries.imageId !== undefined){
                expect($jumbotronForeground).to.have.attr('src').contains(currentSeries.imageId);
            }
        })

        cy.get('.jumbotron').then(($jumbotronBackground) => {
            expect($jumbotronBackground).to.be.visible;

            if (currentSeries.backgroundImageId !== undefined){
                expect($jumbotronBackground).to.have.attr('style').contains(currentSeries.backgroundImageId);
            } else if (currentSeries.imageId !== undefined){
                expect($jumbotronBackground.find('div')).to.have.attr('style').contains(currentSeries.imageId);
            }
        })
    })
})