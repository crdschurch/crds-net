import {ContentfulApi} from '../../support/Contentful/ContentfulApi';

describe("Testing the Current Series on the Media landing page", function(){
    let currentSeries;
    before(function() {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();

        cy.visit('https://mediaint.crossroads.net/');
    })

    //Note: this test is here for convenience but should really live with it's code in crds-media
    it('Tests current series title, title link, and description', function(){
        cy.contains('series').parent().find('.featured > .media-body').as('seriesText')

        cy.get('@seriesText').find('.component-header > a').then(($seriesTitle) => {
            expect($seriesTitle).to.have.attr('href', `/series/${currentSeries.slug}`);
            expect($seriesTitle).to.have.text(`${currentSeries.title}`);
        })

        cy.get('@seriesText').find('div').then(($description) =>{
            expect($description).to.contain(`${currentSeries.description.substring(0,96)}`);
        })
    })

    it('Tests current series image and image link', function(){
        cy.contains('series').as('seriesHeader').should('be.visible');

        cy.get('@seriesHeader').parent().find('.featured > a').then(($imageBlock) => {
            expect($imageBlock).to.have.attr('href', `/series/${currentSeries.slug}`);
            expect($imageBlock.find('img')).to.have.attr('src').contains(`${currentSeries.imageFilename}`);
            expect($imageBlock.find('img')).to.have.attr('srcset'); //If fails, image was not found
        })
    })
})
