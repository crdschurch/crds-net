const moment = require('moment');
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
        cy.get('.jumbotron').as('jumbotron');

        //Main image is displayed correctly
        cy.get('@jumbotron').find('.feature-img').then(($seriesImage) => {
            expect($seriesImage).to.be.visible;
            expect($seriesImage).to.have.attr('src').contains(currentSeries.imageId);
            expect($seriesImage).to.have.attr('srcset'); //If fails, image was not found
        })

        //Background image (jumbotron) displayed correctly
        cy.get('@jumbotron').then(($backgroundImage) => {
            expect($backgroundImage).to.be.visible;
            expect($backgroundImage).to.have.attr('style').contains(currentSeries.backgroundImageId);
        })
    })
})