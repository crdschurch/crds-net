import { ContentfulApi, SeriesModel } from '../../support/ContentfulApi';

describe("Checks Media dropdown has correct information", function () {
    let series;
    before(function () {
        const content = new ContentfulApi();
        series = new SeriesModel();
        content.retrieveCurrentSeries(series);

        cy.visit('/');
        cy.get('a[data-automation-id="sh-media"]').click();
    })

    it('Checks current series image and link', function() {
        cy.get('li[data-automation-id="sh-currentseries"]').as('currentSeriesImage').should('be.visible');

        cy.get('@currentSeriesImage').then(($image) => {
            expect($image.find('a')).to.have.attr('href').contains(`/series/${series.currentSeries.slug}`);
            expect($image.find('a > img')).to.have.attr('src').contains(`${series.currentSeries.imageFileName}`);
        })
    })
})