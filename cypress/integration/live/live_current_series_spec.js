const moment = require('moment');
import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe('Testing the Current Series on the Live page', function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('live');
    })

    //DO NOT RUN in open mode - Causes Cypress to hang
    it('Tests Current Series title, date, and description', function () {
        const startDate = moment(currentSeries.startDate);
        const endDate = moment(currentSeries.endDate);

        cy.get('.current-series').then(($textBlock) => {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.have.text(currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.have.text(`${startDate.format('MM.DD.YYYY')} - ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.have.text(currentSeries.description);
        })
    })

    it('Tests Current Series image', function(){
        cy.get('[data-automation-id="series-image"]').then(($imageBlock) => {
            expect($imageBlock).to.have.attr('src').contains(currentSeries.imageName);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Tests Current Series "Watch Trailer" button and youtube modal', function () {
        cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', currentSeries.youtubeURL);
            expect($trailerButton).to.have.attr('data-toggle', 'modal');
            expect($trailerButton).to.have.attr('data-target', '#trailer-video-modal');
        })

        cy.get('#trailer-video-modal').then(($youtubeModal) => {
            expect($youtubeModal.find('#modal-video-src')).to.have.attr('data-src', currentSeries.youtubeURL);
        })
    })
})