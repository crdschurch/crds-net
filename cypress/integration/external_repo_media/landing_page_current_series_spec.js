import {ContentfulApi} from '../../support/Contentful/ContentfulApi';
import {Formatter} from '../../support/Formatter';


describe("Testing the Current Series on the Media landing page", function(){
    let currentSeries;
    before(function() {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();

        cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/`);
    })

    //Note: this test is here for convenience but should really live with it's code in crds-media
    it('Tests current series title, title link, and description', function(){
        cy.contains('series').parent().find('.featured > .media-body').as('seriesContent')

        cy.get('@seriesContent').find('.component-header > a').then(($seriesTitle) => {
            expect($seriesTitle).to.have.attr('href', `/series/${currentSeries.slug}`);
            expect($seriesTitle).to.have.text(currentSeries.title);
        })

        cy.get('@seriesContent').find('div').should('have.prop', 'textContent').then(($text) => {
            expect(currentSeries.description).to.contain(Formatter.normalizeText($text));
        })
    })

    it('Tests current series image and image link', function(){
        cy.contains('series').as('seriesHeader').should('be.visible');

        cy.get('@seriesHeader').parent().find('.featured > a').then(($imageBlock) => {
            expect($imageBlock).to.have.attr('href', `/series/${currentSeries.slug}`);
            expect($imageBlock.find('img')).to.have.attr('srcset'); //If fails, image was not found

            if (currentSeries.imageId !== undefined){
                expect($imageBlock.find('img')).to.have.attr('src').contains(currentSeries.imageId);
            }
        })
    })
})
