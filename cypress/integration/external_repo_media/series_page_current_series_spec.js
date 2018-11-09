const moment = require('moment');
import {ContentfulApi, SeriesModel} from '../../support/ContentfulApi';

describe("Checks Media/Series page contains correct information ", function(){
    let series;
    before(function() {
        const content = new ContentfulApi();
        series = new SeriesModel();
        content.retrieveCurrentSeries(series);

        cy.visit('https://mediaint.crossroads.net/series/');
    })

    //Note: this test is here for convenience but should really live with it's code in crds-media
    it('Checks current series: title, dates, image and description', function(){
        cy.get('.current-series').as('currentSeriesBlock').should('be.visible');

        const startDate = moment(series.currentSeries.starts_at);
        const endDate = moment(series.currentSeries.ends_at);

        cy.get('@currentSeriesBlock').find('div.col-xs-12.col-md-5').then(($seriesText) => {
            expect($seriesText.find('h1')).to.have.text(series.currentSeries.title);
            expect($seriesText.find('date')).to.have.text(`${startDate.format('MM.DD.YYYY')} — ${endDate.format('MM.DD.YYYY')}`);
            expect($seriesText.find('div > p')).to.have.text(series.currentSeries.description);
        })

        cy.get('@currentSeriesBlock').find('div > a').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('href').contains(`/series/${series.currentSeries.slug}`);
            expect($seriesImage).to.have.attr('title').contains(`${series.currentSeries.title}`);
            expect($seriesImage.find('img')).to.have.attr('src').contains(`${series.currentSeries.imageFileName}`);
        })
    })

    it('Checks view the series button link', function () {
        cy.contains('View the series').then(($linkButton) => {
            expect($linkButton).to.have.attr('href', `/series/${series.currentSeries.slug}`);
        })
    })
})
