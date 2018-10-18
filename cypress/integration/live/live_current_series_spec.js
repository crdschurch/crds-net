import { ContentfulApi } from '../../support/ContentfulApi';

describe("Checks all series information is correct on Live", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();
        cy.visit('live');
    })

    //DO NOT RUN - Causes Cypress to hang
    it('Checkss Current Series displays on Live', function () {
        cy.get('.current-series > div.container > div > div > h3').then(($seriesTitle) => {
            expect($seriesTitle).to.have.text(content.currentSeries.title);
        })
    })
})