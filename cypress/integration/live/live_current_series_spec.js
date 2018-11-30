import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import {DateFormatter} from '../../support/DateFormatter'

describe('Testing the Current Series on the Live page', function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('live');
    })

    //DO NOT RUN in open mode - Causes Cypress to hang
    it('Tests Current Series title, date, and description', function () {
        const startDate = DateFormatter.formatIgnoringTimeZone(currentSeries.startDate, 'MM.DD.YYYY');
        const endDate = DateFormatter.formatIgnoringTimeZone(currentSeries.endDate, 'MM.DD.YYYY');

        cy.get('.current-series').then(($textBlock) => {
            expect($textBlock.find('[data-automation-id="series-title"]')).to.have.text(currentSeries.title);
            expect($textBlock.find('[data-automation-id="series-dates"]')).to.have.text(`${startDate} - ${endDate}`);
            expect($textBlock.find('[data-automation-id="series-description"] > p')).to.have.text(currentSeries.description);
        })
    })

    it('Tests Current Series image', function(){
        cy.get('[data-automation-id="series-image"]').then(($imageBlock) => {
            expect($imageBlock).to.have.attr('src').contains(currentSeries.imageId);
            expect($imageBlock).to.have.attr('srcset'); //If fails, image was not found
        })
    })

    it(`Tests Current Series' "Watch Trailer" button and youtube modal, if series has trailer`, function () {
        //Test trailer button attributes
        if (currentSeries.youtubeURL == undefined){
            cy.get('[data-automation-id="series-youtube"]').should('not.exist');
        } else {
            cy.get('[data-automation-id="series-youtube"]').then(($trailerButton) => {
                expect($trailerButton).to.have.attr('href', currentSeries.youtubeURL);
                expect($trailerButton).to.have.attr('data-toggle', 'modal');
                expect($trailerButton).to.have.attr('data-target', '#trailer-video-modal');
            })
        }

        //Test modal attributes
        cy.get('#trailer-video-modal').find('#modal-video-src').as('youtubeModal').should('exist');
        const modalSource = currentSeries.youtubeURL == undefined ? '' : currentSeries.youtubeURL;
        cy.get('@youtubeModal').should('have.attr', 'data-src', modalSource);
    })
})