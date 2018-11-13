import { ContentfulApi, SeriesModel } from '../../support/ContentfulApi';

describe("Testing the Current Series in the Shared Header/Media dropdown", function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = new SeriesModel();
        content.retrieveCurrentSeries(currentSeries);

        cy.visit('/');
        cy.get('a[data-automation-id="sh-media"]').click();
    })

    it('Checks current series image and link', function() {
        cy.get('li[data-automation-id="sh-currentseries"]').as('currentSeriesImage').should('be.visible');

        cy.get('@currentSeriesImage').then(($image) => {
            expect($image.find('a')).to.have.attr('href').contains(`/series/${currentSeries.slug}`);
            expect($image.find('a > img')).to.have.attr('src').contains(`${currentSeries.imageFilename}`);
        })
    })
})