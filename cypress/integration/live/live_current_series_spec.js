const moment = require('moment');
import { ContentfulApi, SeriesModel } from '../../support/ContentfulApi';

describe("Checks all series information is correct on Live", function () {
    let series;
    before(function () {
        const content = new ContentfulApi();
        series = new SeriesModel();
        content.retrieveCurrentSeries(series);
        cy.visit('live');
    })

    //DO NOT RUN in open mode - Causes Cypress to hang
    it('Checks current series: title, dates, image and description', function () {
        cy.get('.current-series').as('currentSeriesBlock').should('be.visible');

        const startDate = moment(series.currentSeries.starts_at);
        const endDate = moment(series.currentSeries.ends_at);

        cy.get('@currentSeriesBlock').then(($textBlock)=> {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.have.text(series.currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.have.text(`${startDate.format('MM.DD.YYYY')} - ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.have.text(series.currentSeries.description);
        })

        cy.get('[data-automation-id="series-image"]').then(($imageBlock)=> {
            expect($imageBlock).to.have.attr('src').contains(series.currentSeries.imageFileName);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Checks current series trailer link and modal source', function () {
        cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', series.currentSeries.youtube_url);
        })

        cy.get('#modal-video-src').then(($youtubeModal) => {
            expect($youtubeModal).to.have.attr('data-src', series.currentSeries.youtube_url);
        })
    })
})