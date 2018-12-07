import {ContentfulApi} from '../../support/Contentful/ContentfulApi';
import {Formatter} from '../../support/Formatter'

describe("Testing the Latest Message on the Homepage", function () {
    let latestMessage;
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        latestMessage = content.retrieveLatestMessage();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('');
    })

    it('Tests Current Message title, description and image', function(){
        cy.get('[data-automation-id="message-title"]').should('be.visible')
        .then($title =>{
            expect($title).to.have.attr('href', `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}/${latestMessage.slug}`);
            expect($title).to.have.text(latestMessage.title);
        })

        cy.get('[data-automation-id="message-description"]').should('have.prop', 'textContent').then(($text) => {
            expect(latestMessage.description).to.contain(Formatter.normalizeText($text));
        })

        cy.get('[data-automation-id="message-video"]').then(($imageBlock) => {
            expect($imageBlock).to.have.attr('href', `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}/${latestMessage.slug}`);
            expect($imageBlock.find('img')).to.have.attr('srcset'); //If fails, image was not found

            if (latestMessage.imageId !== undefined){
                expect($imageBlock.find('img')).to.have.attr('src').contains(latestMessage.imageId);
            }
        })
    })

    it('Test "View latest now" button link', function () {
        cy.get('[data-automation-id="watch-message-button"]').should('be.visible')
        .then(($messageButton) => {
            expect($messageButton).to.have.attr('href').contains(latestMessage.slug);
        })
    })
});
