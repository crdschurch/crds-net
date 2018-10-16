//TODO check all the series information on the homepage is correct
const moment = require('moment');
import { ContentfulApi } from '../../support/ContentfulApi';

describe("Checks all series information is correct on Homepage", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();
        cy.visit('/');
    })

    it('Checks current series title', function () {
        cy.get('.current-series > div.container > div > div > h3').then(($seriesTitle) => {
            expect($seriesTitle).to.have.text(content.currentSeries.title);
        })
    })

    it('Checks current series image', function () {
        cy.get('.current-series > div > img').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
        })
    })

    it('Checks current series dates', function () {
        const startDate = moment(content.currentSeries.starts_at);
        const endDate = moment(content.currentSeries.ends_at);

        cy.get('.current-series > div.container > div > div > .card-subtitle').then(($seriesDate) => {
            expect($seriesDate).to.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
        })
    })

    it('Checks current series description', function () {
        cy.get('.current-series > div.container > div > div > .card-text > div > p').then(($seriesDescription) => {
            expect($seriesDescription).to.have.text(content.currentSeries.description);
        })
    })

    //TODO this way of finding the link isn't unique - may find the Jumbotron link instead of main. Need to add animation id
    it('Checks current series trailer button link', function () {
        cy.contains('Watch the trailer').then(($trailerButton) => {
            expect($trailerButton).to.have.attr('href', content.currentSeries.youtube_url);
        })
    })

    it('Checks current series title on Jumbotron', function () {
        cy.get('div[data-automation-id="stream-card"] > div.card-block.flush-bottom.hard > .card-title').then(($seriesTitle) => {
            expect($seriesTitle).to.have.text(content.currentSeries.title);
        })
    })

    it('Checks current series image on Jumbotron', function () {
        cy.get('div[data-automation-id="upcomingImg"] > img').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
        })
    })

    it('Checks current series dates on Jumbotron', function () {
        const startDate = moment(content.currentSeries.starts_at);
        const endDate = moment(content.currentSeries.ends_at);

        cy.get('div[data-automation-id="stream-card"] > div.card-block.flush-bottom.hard > h5').then(($seriesDate) => {
            expect($seriesDate).to.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
        })
    })

    //TODO add automation id to differentiate links
    // it('Checks current series trailer button link in Jumbotron', function () {
    //     cy.contains('Watch the trailer').then(($trailerButton) => {
    //         expect($trailerButton).to.have.attr('href', content.currentSeries.youtube_url);
    //     })
    // })
})