import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe('Testing the Current Series on Locations pages (served from Netlify)', function () {
    let currentSeries;
    let locationList;
    before(function () {
        const content = new ContentfulApi();
        const seriesManager = content.retrieveSeriesManager();
        locationList = content.retrieveLocations();

        cy.wrap({seriesManager}).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
            currentSeries = seriesManager.currentSeries;
        });
    });

    it('Checks current series link', function() {
        assert.isAbove(locationList.length, 1, 'Sanity check: More than one location is served from Contentful');

        cy.visit(locationList[0].slug);

        cy.get('[data-automation-id="series-slug"]').as('currentSeriesButton');
        cy.get('@currentSeriesButton').should('be.visible').and('have.attr', 'href', `/series/${currentSeries.slug.text}`);
    });
});