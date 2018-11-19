const moment = require('moment');
import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe("Testing the Current Series on the Homepage", function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('/');
    })

    it('Tests Current Series title, date, and description', function(){
        cy.log(currentSeries.endDate);
        const startDate = moment(currentSeries.startDate);
        const endDate = moment(currentSeries.endDate);
        cy.log(endDate.format());

        cy.get('.current-series').then(($textBlock)=> {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.be.visible.and.have.text(currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.be.visible.and.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.be.visible.and.have.text(currentSeries.description);
        })
    })

    it('Tests Current Series image', function(){
        cy.get('[data-automation-id="series-image"]').then(($imageBlock)=> {
            expect($imageBlock).to.be.visible;
            expect($imageBlock).to.have.attr('src').contains(`${currentSeries.imageFilename}`);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Tests Current Series and Jumbotron "Watch the trailer" button link, if series has trailer', function () {
        if(currentSeries.youtubeURL == undefined){
            cy.get('[data-automation-id="series-youtube"]').should('not.exist');
            cy.get('[data-automation-id="jumbotron-series-youtube"]').should('not.exist');
        }
        else {
            //Main Current Series display
            cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
                expect($trailerButton).to.be.visible;
                expect($trailerButton).to.have.attr('href', currentSeries.youtubeURL);
            })

            //Jumbotron display
            cy.get('[data-automation-id="jumbotron-series-youtube"]').then(($trailerLink) => {
                expect($trailerLink).to.have.attr('href', currentSeries.youtubeURL);
            })
        }
    })

    it('Tests Jumbotron Current Series title, dates, image, and description', function () {
        cy.get('[data-automation-id="jumbotron-series-title"]').should('have.text', currentSeries.title);

        const startDate = moment(currentSeries.startDate);
        const endDate = moment(currentSeries.endDate);
        cy.get('[data-automation-id="jumbotron-series-dates"]').should('have.text', `${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);

        cy.get('[data-automation-id="jumbotron-series-image"]').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('src').contains(`${currentSeries.imageFilename}`);
            expect($seriesImage).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Tests Jumbotron "View more messages" links', function () {
        //View more messages
        cy.get('#lastMessageCTA').then(($messageLink) => {
            expect($messageLink).to.have.attr('href', '/series');
        })
    })
})
