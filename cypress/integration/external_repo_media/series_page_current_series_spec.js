const moment = require('moment');
import {ContentfulApi} from '../../support/Contentful/ContentfulApi';

describe("Tesing the Current Series on the Media/Series page", function(){
    let currentSeries;
    before(function() {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();

        cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/`);
    })

    //Note: this test is here for convenience but should really live with it's code in crds-media
    it('Tests current series title, date range, and description', function(){
        cy.get('.current-series').as('currentSeriesBlock').should('be.visible');

        const startDate = moment(currentSeries.startDate);
        const endDate = moment(currentSeries.endDate);

        cy.get('@currentSeriesBlock').find('div.col-xs-12.col-md-5').then(($seriesTextBlock) => {
            expect($seriesTextBlock.find('h1')).to.have.text(currentSeries.title);
            expect($seriesTextBlock.find('date')).to.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
            expect($seriesTextBlock.find('div > p')).to.have.text(currentSeries.description);
        })
    })

    it('Tests current series image and image link', function(){
        cy.get('.current-series > div > a').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('href').contains(`/series/${currentSeries.slug}`);
            expect($seriesImage.find('img')).to.have.attr('src').contains(`${currentSeries.imageId}`);
        })
    })

    it('Tests the "View the series" button link', function () {
        cy.contains('View the series').then(($button) => {
            expect($button).to.have.attr('href', `/series/${currentSeries.slug}`);
        })
    })
})
