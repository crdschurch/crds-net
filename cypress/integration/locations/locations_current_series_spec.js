import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe('Testing the Current Series on Locations pages:', function () {
    let currentSeries;
    let locationList;
    before(function () {
        const content = new ContentfulApi();
        const seriesManager = content.retrieveSeriesManager();
        locationList = content.retrieveLocations();

        cy.wrap({seriesManager}).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
            currentSeries = seriesManager.currentSeries;
        });

        cy.wrap({locationList}).its('locationList.length').should('be.above', 0).then(() => {
        });
    });

    it('Check out latest series button should link to the current series', function() {
        cy.visit(locationList[0].slug);

        cy.get('[data-automation-id="series-slug"]').as('currentSeriesButton');
        cy.get('@currentSeriesButton').should('be.visible').and('have.attr', 'href', `/series/${currentSeries.slug.text}`);
    });
});