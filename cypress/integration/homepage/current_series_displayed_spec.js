import {ContentfulApi} from '../../support/ContentfulApi';
//TODO remove - code moved to other files
describe("Current Series is the same across site", function(){
    let content;
    before(function() {
        content = new ContentfulApi();
        content.retrieveCurrentSeries();
        content.retrieveLocations();
    })

    // it('Verifies Current Series displays on Homepage', function() {
    //     cy.visit('/');

    //     //Verify card is visible
    //     cy.get('.current-series').should('be.visible');

    //     //Verify visible series title
    //     cy.get('.current-series > div.container > div > div > h3').then(($seriesTitle) => {
    //         expect($seriesTitle).to.have.text(content.currentSeries.title);
    //     })

    //     //Verify visible image
    //     cy.get('.current-series > div > img').then(($seriesImage) => {
    //         expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
    //     })

    //     //Verify link in button
    //     cy.contains('View latest now').then(($linkButton) => {
    //         expect($linkButton).to.have.attr('href').contains(`/series/${content.currentSeries.slug}`);
    //     })
    // })

    // it('Verifies Current Series displays on Homepage Jumbotron', function() {
    //     cy.visit('/');

    //     //Verify visible series title
    //     cy.get('.streamService > div > div.card-block.flush-bottom.hard > .card-title').then(($seriesTitle) => {
    //         expect($seriesTitle).to.have.text(content.currentSeries.title);
    //     })

    //     //Verify visible image
    //     cy.get('div[data-automation-id="upcomingImg"] > img').then(($seriesImage) => {
    //         expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
    //     })
    // })

    // it('Verifies Current Series displays on the Shared Header Media dropdown', function() {
    //     cy.visit('/');

    //     //Verify link
    //     //Note: as of Oct 2018 this is still out of Silverstripe, so not guaranteed to match Contentful's content
    //     cy.get('li[data-automation-id="sh-currentseries"] > a').then(($imgLink) => {
    //         expect($imgLink).to.have.attr('href').contains(`/series/${content.currentSeries.slug}`);
    //     })

    //     //Verify visible image
    //     cy.get('li[data-automation-id="sh-currentseries"] > a > img').then(($seriesImage) => {
    //         expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
    //     })
    // })

    //Causes Cypress to hang - fix in progress
    // it('Verifies Current Series displays on Live', function() {
    //     cy.visit('live');
    //     cy.get('.current-series > div.container > div > div > h3').then(($seriesTitle) => {
    //         expect($seriesTitle).to.have.text(content.currentSeries.title);
    //     })
    // })

    // it('Verifies Current Series displays on Locations page (Contentful)', function(){
    //     assert.isAbove(content.locationList.length, 1, 'More than one location is served from Contentful');

    //     cy.visit(content.locationList[0].fields.slug);
    //     cy.contains('Check out our latest series').then(($seriesButton) => {
    //         expect($seriesButton).to.have.attr('href', `/series/${content.currentSeries.slug}`);
    //     })
    // })


    //Note: this test is here for convenience but should really live with it's code in crds-media
    // it('Verifies Current Series displayed on Media - Series', function(){
    //     cy.visit('https://mediaint.crossroads.net/series/');

    //     //Verify visible series title
    //     cy.get('.current-series > div.col-xs-12.col-md-5 > h1').then(($seriesTitle) => {
    //         expect($seriesTitle).to.have.text(content.currentSeries.title); //Known bug
    //     })

    //     //Verify visible image
    //     cy.get('.current-series > div > a > img').then(($seriesImage) => {
    //         expect($seriesImage).to.have.attr('src').contains(`${content.currentSeries.imageFileName}`);
    //     })

    //     //Verify link in button
    //     cy.contains('View the series').then(($linkButton) => {
    //         expect($linkButton).to.have.attr('href', `/series/${content.currentSeries.slug}`);
    //     })
    // })
})
