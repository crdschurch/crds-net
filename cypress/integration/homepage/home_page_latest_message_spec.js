// check this file using TypeScript if available
//@ts-check //TODO get this working

import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ElementValidator } from '../../support/ElementValidator';
import { ContentfulElementValidator } from '../../support/Cypress/ContentfulElementValidator';
import { Formatter } from '../../support/Formatter';

describe('Testing the Latest Message on the Homepage', function () {
    let latestMessage;
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        latestMessage = content.retrieveLatestMessage();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('/');
    });

    it.only('Tests Current Message title, description, and image', function () {
        //TODO assert slugs are required
        const messageLink = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}/${latestMessage.slug.text}`;
        cy.get('[data-automation-id="message-title"]').as('title');
        cy.get('@title').should('be.visible');
        ContentfulElementValidator.containsText(cy.get('@title'), latestMessage.title);
        cy.get('@title').should('have.attr', 'href', messageLink);


        cy.get('[data-automation-id="message-description"]').as('description');
        cy.get('@description').should('be.visible');
        ContentfulElementValidator.containsText(cy.get('@description'), latestMessage.description);

        cy.get('[data-automation-id="message-video"]').as('video');
        cy.get('@video').should('be.visible');


        //ElementValidator.elementHasImgixImageAndLink(cy.get('[data-automation-id="message-video"]'), latestMessage.imageId, messageLink);
    });

    it('Test "View latest now" button link', function () {
        cy.get('[data-automation-id="watch-message-button"]').should('be.visible')
            .then(($messageButton) => {
                expect($messageButton).to.have.attr('href').contains(latestMessage.slug);
            });
    });
});
