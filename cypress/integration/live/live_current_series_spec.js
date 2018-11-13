const moment = require('moment');
import { ContentfulApi, SeriesModel } from '../../support/ContentfulApi';

describe('Testing the Current Series on the Live page', function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = new SeriesModel();
        content.retrieveCurrentSeries(currentSeries);
        cy.visit('live');
    })

    //DO NOT RUN in open mode - Causes Cypress to hang
    it('Checks current series: title, dates, image and description', function () {
        cy.get('.current-series').as('currentSeriesBlock').should('be.visible');

        const startDate = moment(currentSeries.startDate);
        const endDate = moment(currentSeries.endDate);

        cy.get('@currentSeriesBlock').then(($textBlock)=> {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.have.text(currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.have.text(`${startDate.format('MM.DD.YYYY')} - ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.have.text(currentSeries.description);
        })

        cy.get('[data-automation-id="series-image"]').then(($imageBlock)=> {
            expect($imageBlock).to.have.attr('src').contains(currentSeries.imageFilename);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Checks current series trailer link and modal source', function () {
        cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', currentSeries.youtubeURL);
        })

        cy.get('#modal-video-src').then(($youtubeModal) => {
            expect($youtubeModal).to.have.attr('data-src', currentSeries.youtubeURL);
        })
    })
})