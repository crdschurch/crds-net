import {ContentfulApi} from '../../support/Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../support/Cypress/ContentfulElementValidator';

describe('Tesing the Current Series on the Media/Series page', function(){
    let currentSeries;
    before(function() {
        const content = new ContentfulApi();
        const series = content.retrieveSeriesManager();

        cy.wrap({series}).its('series.currentSeries').should('not.be.undefined').then(() => {
            currentSeries = series.currentSeries;
            cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/`);
        });
    });

    //Note: this test is here for convenience but should really live with it's code in crds-media
    it('Tests current series title, date range, and description', function(){
        cy.get('.current-series').as('currentSeriesBlock');

        cy.get('@currentSeriesBlock').find('h1').as('currentSeriesTitle');
        cy.get('@currentSeriesTitle').should('be.visible').and('contain', currentSeries.title.text);

        const seriesRange = `${currentSeries.startDate.formattedDateNoZone} — ${currentSeries.endDate.formattedDateNoZone}`;
        cy.get('@currentSeriesBlock').find('date').as('currentSeriesDateRange');
        cy.get('@currentSeriesDateRange').should('be.visible').and('contain', seriesRange);

        cy.get('@currentSeriesBlock').find('div.col-xs-12.col-md-5 > div').as('currentSeriesDescription');
        cy.get('@currentSeriesDescription').should('be.visible');
        Element.shouldContainText(cy.get('@currentSeriesDescription'), currentSeries.description);
    });

    it('Tests current series image and image link', function(){
        cy.get('.current-series > div > a').as('currentSeriesImage');
        cy.get('@currentSeriesImage').should('be.visible').and('have.attr', 'href', `/series/${currentSeries.slug.text}`);

        Element.shouldHaveImgixImage(cy.get('@currentSeriesImage').find('img'), currentSeries.image);
    });

    it('Tests the "View the series" button link', function () {
        cy.contains('View the series').as('viewSeriesButton');
        cy.get('@viewSeriesButton').should('be.visible').and('have.attr', 'href', `/series/${currentSeries.slug.text}`);
    });
});
