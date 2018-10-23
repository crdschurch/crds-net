import { ContentfulApi } from '../../support/ContentfulApi';

describe("Checks Media dropdown has correct information", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();
        cy.visit('/');
        cy.get('a[data-automation-id="sh-media"]').click();
    })

    it('Checks current series image and link', function() {
        cy.get('li[data-automation-id="sh-currentseries"]').as('currentSeriesImage').should('be.visible');

        cy.get('@currentSeriesImage').then(($image) => {
            expect($image.find('a')).to.have.attr('href').contains(`/series/${content.currentSeries.slug}`);
            expect($image.find('a > img')).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
        })
    })
})