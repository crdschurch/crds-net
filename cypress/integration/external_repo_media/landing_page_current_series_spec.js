import {ContentfulApi} from '../../support/ContentfulApi';

describe("Checks Media landing page contains correct information ", function(){
    let content;
    before(function() {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();

        cy.visit('https://mediaint.crossroads.net/');
    })

    //Note: this test is here for convenience but should really live with it's code in crds-media
    it('Checks current series: title, dates, image and description', function(){
        cy.contains('series').as('seriesHeader').should('be.visible');

        //Check image block
        cy.get('@seriesHeader').parent().find('.featured > a').then(($seriesBlock) => {
            expect($seriesBlock).to.have.attr('href', `/series/${content.currentSeries.slug}`);
            expect($seriesBlock.find('img')).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
        })

        //Check text block
        cy.get('@seriesHeader').parent().find('.featured > .media-body > .component-header > a').then(($seriesBlock) => {
            expect($seriesBlock).to.have.attr('href', `/series/${content.currentSeries.slug}`);
            expect($seriesBlock).to.have.text(`${content.currentSeries.title}`);
        })
    })
})
