import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe("Testing the Current Series in the Shared Header/Media dropdown", function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();

        cy.visit('/');
        cy.get('a[data-automation-id="sh-media"]').click();
    })

    it.skip('Tests Current Series image and link', function() {
        cy.get('li[data-automation-id="sh-currentseries"]').as('currentSeriesImage').should('be.visible');

        //Skip in demo - shared header points to prod
        if (!Cypress.env('CRDS_MEDIA_ENDPOINT').includes('demo')){
            const seriesLink = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}`;

            cy.get('@currentSeriesImage').find('a').then(($image) => {
                expect($image).to.have.attr('href').contains(`/series/${currentSeries.slug}`);

                if (currentSeries.imageId !== undefined){
                    expect($image.find('img')).to.have.attr('src').contains(currentSeries.imageId);
                }
            })
        }
    })
})