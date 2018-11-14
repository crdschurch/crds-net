const moment = require('moment');
import { ContentfulApi } from '../../support/ContentfulApi';

describe("Checks all series information is correct on Homepage", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();
        cy.visit('/');
    })

    it('Checks main current series: title, dates, image and description', function () {
        cy.get('.current-series').as('currentSeriesBlock');
        const startDate = moment(content.currentSeries.starts_at);
        const endDate = moment(content.currentSeries.ends_at);

        cy.get('@currentSeriesBlock').then(($textBlock)=> {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.be.visible.and.have.text(content.currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.be.visible.and.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.be.visible.and.have.text(content.currentSeries.description);
        })

        cy.get('[data-automation-id="series-image"]').then(($imageBlock)=> {
            expect($imageBlock).to.be.visible;
            expect($imageBlock).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Checks current series trailer button link', function () {
        cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.be.visible;
            expect($trailerButton).to.have.attr('href', content.currentSeries.youtube_url);
        })
    })

    it('Checks jumbotron current series: title, dates, image and description', function () {
        cy.get('[data-automation-id="jumbotron-series-title"]').should('have.text', content.currentSeries.title);

        const startDate = moment(content.currentSeries.starts_at);
        const endDate = moment(content.currentSeries.ends_at);
        cy.get('[data-automation-id="jumbotron-series-dates"]').should('have.text', `${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);

        cy.get('[data-automation-id="jumbotron-series-image"]').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
            expect($seriesImage).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it('Checks current series trailer button link in Jumbotron', function () {
        cy.get('[data-automation-id="jumbotron-series-youtube"]').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', content.currentSeries.youtube_url);
        })
    })
})
