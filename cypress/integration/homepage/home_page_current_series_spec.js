import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { Formatter } from '../../support/Formatter'

describe("Testing the Current Series on the Homepage", function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('/');
    })

    it('Tests current series title and description', function(){
        cy.get('[data-automation-id="series-title"]').then(($seriesTitle) => {
            expect($seriesTitle).to.be.visible;
            expect($seriesTitle).to.have.attr('href', `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}`);
            expect($seriesTitle).to.have.text(currentSeries.title);
        })

        //desc
        cy.get('[data-automation-id="series-description"]').should('be.visible')
        .should('have.prop', 'textContent').then(($text) => {
            expect(currentSeries.description).to.contain(Formatter.normalizeText($text));
        })
    })

    it('Tests Current Series image', function(){
        cy.get('[data-automation-id="series-image"] > img').then(($imageBlock)=> {
            expect($imageBlock).to.be.visible;

            if (currentSeries.imageId !== undefined){
                expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
                expect($imageBlock).to.have.attr('src').contains(currentSeries.imageId);
            }
        })
    })

    it('Tests Watch Latest Service button link', function(){
        //Desktop
        cy.get('[data-automation-id="watch-series-button"]').then(($watchSeries) =>{
            expect($watchSeries).to.be.visible;
            expect($watchSeries).to.have.attr('href', `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}`)
        })

        //Mobile
        cy.get('[data-automation-id="mobile-watch-series-button"]').then(($watchSeries) =>{
            expect($watchSeries).to.not.be.visible;
            expect($watchSeries).to.have.attr('href', `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}`)
        })
    })
})
