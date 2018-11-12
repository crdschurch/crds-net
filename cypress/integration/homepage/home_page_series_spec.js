const moment = require('moment');
import { ContentfulApi, SeriesModel } from '../../support/ContentfulApi';
//TODO break these tests into smaller chunks
describe("Checks all series information is correct on Homepage", function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = new SeriesModel();
        content.retrieveCurrentSeries(currentSeries);
        cy.visit('/');
    })

    it('Checks main current series: title, dates, image and description', function () {
        cy.get('.current-series').as('currentSeriesBlock');
        const startDate = moment(currentSeries.startDate);
        const endDate = moment(currentSeries.endDate);

        cy.get('@currentSeriesBlock').then(($textBlock)=> {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.be.visible.and.have.text(currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.be.visible.and.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.be.visible.and.have.text(currentSeries.description);
        })

        cy.get('[data-automation-id="series-image"]').then(($imageBlock)=> {
            expect($imageBlock).to.be.visible;
            expect($imageBlock).to.have.attr('src').contains(`${currentSeries.imageFilename}`);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Checks current series trailer button link', function () {
        cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.be.visible;
            expect($trailerButton).to.have.attr('href', currentSeries.youtubeURL);
        })
    })

    it('Checks jumbotron current series: title, dates, image and description', function () {
        cy.get('[data-automation-id="jumbotron-series-title"]').should('have.text', currentSeries.title);

        const startDate = moment(currentSeries.startDate);
        const endDate = moment(currentSeries.endDate);
        cy.get('[data-automation-id="jumbotron-series-dates"]').should('have.text', `${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);

        cy.get('[data-automation-id="jumbotron-series-image"]').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('src').contains(`${currentSeries.imageFilename}`);
            expect($seriesImage).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Checks current series trailer button link in Jumbotron', function () {
        cy.get('[data-automation-id="jumbotron-series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', currentSeries.youtubeURL);
        })
    })
})
