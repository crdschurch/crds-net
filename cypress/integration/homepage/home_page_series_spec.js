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
        cy.get('.current-series').as('currentSeriesBlock').should('be.visible');

        const startDate = moment(content.currentSeries.starts_at);
        const endDate = moment(content.currentSeries.ends_at);

        cy.get('@currentSeriesBlock').find('div.container > div > div').then(($textBlock)=> {
            expect($textBlock.find('h3')).to.have.text(content.currentSeries.title);
            expect($textBlock.find('.card-subtitle')).to.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
            expect($textBlock.find('.card-text > div > p')).to.have.text(content.currentSeries.description);
        })

        cy.get('@currentSeriesBlock').find('div > img').then(($imageBlock)=> {
            expect($imageBlock).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
        })
    })

    //TODO this way of finding the link isn't unique - may find the Jumbotron link instead of main. Need to add animation id
    it('Checks current series trailer button link', function () {
        cy.contains('Watch the trailer').then(($trailerButton) => { //and is visible?
            expect($trailerButton).to.have.attr('href', content.currentSeries.youtube_url);
        })
    })

    it('Checks jumbotron current series: title, dates, image and description', function () {
        cy.get('div[data-automation-id="upcomingImg"] > img').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
        })

        const startDate = moment(content.currentSeries.starts_at);
        const endDate = moment(content.currentSeries.ends_at);

        cy.get('div[data-automation-id="stream-card"]').then(($seriesText) => {
            expect($seriesText.find('div.card-block.flush-bottom.hard > .card-title')).to.have.text(content.currentSeries.title);
            expect($seriesText.find('div.card-block.flush-bottom.hard > h5')).to.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
        })
    })

    //TODO add automation id to differentiate links
    it('Checks current series trailer button link in Jumbotron', function () {
        cy.contains('Watch the trailer').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', content.currentSeries.youtube_url);
        })
    })
})