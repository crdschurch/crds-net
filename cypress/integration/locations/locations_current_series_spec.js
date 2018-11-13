import { ContentfulApi, SeriesModel } from '../../support/ContentfulApi';

describe("Testing the Current Series on Locations pages (served from Netlify)", function () {
    let currentSeries;
    let content;
    before(function () {
        content = new ContentfulApi();
        currentSeries = new SeriesModel();
        content.retrieveCurrentSeries(currentSeries);
        content.retrieveLocations();
    })

    it('Checks current series link', function() {
        assert.isAbove(content.locationList.length, 1, 'Sanity check: More than one location is served from Contentful');

        cy.visit(content.locationList[0].fields.slug);
        cy.get('[data-automation-id="series-slug"]').then(($seriesButton) => {
            expect($seriesButton).to.have.attr('href', `/series/${currentSeries.slug}`);
        })
    })
})