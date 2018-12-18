import {ContentfulApi} from '../../support/Contentful/ContentfulApi';
import {Formatter} from '../../support/Formatter'

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

        const startDate = Formatter.formatDateIgnoringTimeZone(currentSeries.startDate, 'MM.DD.YYYY');
        const endDate = Formatter.formatDateIgnoringTimeZone(currentSeries.endDate, 'MM.DD.YYYY');

        cy.get('@currentSeriesBlock').find('div.col-xs-12.col-md-5').then(($seriesTextBlock) => {
            expect($seriesTextBlock.find('h1')).to.be.visible.and.have.text(currentSeries.title);
            expect($seriesTextBlock.find('date')).to.be.visible.and.have.text(`${startDate} — ${endDate}`);
            expect($seriesTextBlock.find('div')).to.be.visible;
        })

        cy.get('@currentSeriesBlock').find('div.col-xs-12.col-md-5 > div').should('have.prop', 'textContent').then(($text) =>{
            expect(Formatter.normalizeText($text)).to.equal(currentSeries.description);
        })
    })

    it('Tests current series image and image link', function(){
        cy.get('.current-series > div > a').then(($seriesImage) => {
            expect($seriesImage).to.have.attr('href').contains(`/series/${currentSeries.slug}`);

            if (currentSeries.imageId !== undefined){
                expect($seriesImage.find('img')).to.have.attr('src').contains(currentSeries.imageId);
            }
        })
    })

    it('Tests the "View the series" button link', function () {
        cy.contains('View the series').then(($button) => {
            expect($button).to.have.attr('href', `/series/${currentSeries.slug}`);
        })
    })
})
