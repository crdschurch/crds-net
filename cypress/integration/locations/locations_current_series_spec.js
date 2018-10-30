import { ContentfulApi } from '../../support/ContentfulApi';

describe("Checks Locations pages served from Netlify display correct information", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();
        content.retrieveLocations();
    })

    it('Checks current series link', function() {
        assert.isAbove(content.locationList.length, 1, 'Sanity check: More than one location is served from Contentful');

        cy.visit(content.locationList[0].fields.slug);
        cy.get('[data-automation-id="series-slug"]').then(($seriesButton) => {
            expect($seriesButton).to.have.attr('href', `/series/${content.currentSeries.slug}`);
        })
    })
})