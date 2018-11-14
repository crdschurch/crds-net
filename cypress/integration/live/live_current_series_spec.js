const moment = require('moment');
import { ContentfulApi } from '../../support/ContentfulApi';

describe("Checks all series information is correct on Live", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();
        cy.visit('live');
    })

    //DO NOT RUN in open mode - Causes Cypress to hang
    it('Checks current series: title, dates, image and description', function () {
        cy.get('.current-series').as('currentSeriesBlock').should('be.visible');

        const startDate = moment(content.currentSeries.starts_at);
        const endDate = moment(content.currentSeries.ends_at);

        cy.get('@currentSeriesBlock').then(($textBlock)=> {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.have.text(content.currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.have.text(`${startDate.format('MM.DD.YYYY')} - ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.have.text(content.currentSeries.description);
        })

        cy.get('[data-automation-id="series-image"]').then(($imageBlock)=> {
            expect($imageBlock).to.have.attr('src').contains(content.currentSeries.imageFileName);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Checks current series trailer link and modal source', function () {
        cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', content.currentSeries.youtube_url);
        })

        cy.get('#modal-video-src').then(($youtubeModal) => {
            expect($youtubeModal).to.have.attr('data-src', content.currentSeries.youtube_url);
        })
    })
})