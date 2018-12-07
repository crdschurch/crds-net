import {ContentfulApi} from '../../support/Contentful/ContentfulApi';
import {Formatter} from '../../support/Formatter'

//TODO move these to a shared location
function elementHasTextAndLink(element, text, link) {
    element.should('be.visible')
    .then($elm =>{
        expect($elm).to.have.text(text);
        expect($elm).to.have.attr('href', link);
    })
}

function elementContainsSubstringOfText(element, text) {
    element.should('be.visible')
    .should('have.prop', 'textContent').then($text => {
        expect(text).to.contain(Formatter.normalizeText($text));
    })
}

function elementHasImgixImageAndLink(element, imageId, link) {
    element.should('be.visible')
    .then($elm => {
        expect($elm).to.have.attr('href', link);
    })
    .find('img').then($img =>{
        expect($img).to.have.attr('srcset'); //If this fails, Imgix was not run

        if (imageId !== undefined){
            expect($img).to.have.attr('src').contains(imageId);
        }
    })
}

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
        elementHasTextAndLink(cy.get('[data-automation-id="message-title"]'), latestMessage.title, `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}/${latestMessage.slug}`)
        elementContainsSubstringOfText(cy.get('[data-automation-id="message-description"]'), latestMessage.description);
        elementHasImgixImageAndLink(cy.get('[data-automation-id="message-video"]'), latestMessage.imageId, `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}/${latestMessage.slug}`);
    })

    it('Test "View latest now" button link', function () {
        cy.get('[data-automation-id="watch-message-button"]').should('be.visible')
        .then(($messageButton) => {
            expect($messageButton).to.have.attr('href').contains(latestMessage.slug);
        })
    })
});
