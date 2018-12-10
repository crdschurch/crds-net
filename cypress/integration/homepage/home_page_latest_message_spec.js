import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ElementValidator } from '../../support/ElementValidator'

describe("Testing the Latest Message on the Homepage", function (){
    let latestMessage;
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        latestMessage = content.retrieveLatestMessage();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('');
    })

    it('Tests Current Message title, description, and image', function(){
        const messageLink = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}/${latestMessage.slug}`;

        ElementValidator.elementHasTextAndLink(cy.get('[data-automation-id="message-title"]'), latestMessage.title, messageLink)
        ElementValidator.elementContainsSubstringOfText(cy.get('[data-automation-id="message-description"]'), latestMessage.description);
        ElementValidator.elementHasImgixImageAndLink(cy.get('[data-automation-id="message-video"]'), latestMessage.imageId, messageLink);
    })

    it('Test "View latest now" button link', function () {
        cy.get('[data-automation-id="watch-message-button"]').should('be.visible')
        .then(($messageButton) => {
            expect($messageButton).to.have.attr('href').contains(latestMessage.slug);
        })
    })
});
