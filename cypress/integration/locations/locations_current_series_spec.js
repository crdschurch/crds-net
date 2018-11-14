import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe("Testing the Current Series on Locations pages (served from Netlify)", function () {
    let currentSeries;
    let locationList;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();
        locationList = content.retrieveLocations();
    })

    it('Checks current series link', function() {
        assert.isAbove(locationList.length, 1, 'Sanity check: More than one location is served from Contentful');

        cy.visit(locationList[0].slug);
        cy.get('[data-automation-id="series-slug"]').then(($seriesButton) => {
            expect($seriesButton).to.have.attr('href', `/series/${currentSeries.slug}`);
        })
    })
})