import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../support/Cypress/ContentfulElementValidator';

//TODO instead of "normalize" use plainText
//TODO put test functions before tests

describe('Testing the Latest Message on the Homepage', function () {
    let currentMessage;
    let currentSeries;
    let messageURL;
    before(function () {
        const content = new ContentfulApi();
        const messageList = content.retrieveListOfMessages(1);
        const seriesManager = content.retrieveSeriesManager();

        cy.wrap({messageList}).its('messageList.latestMessage').should('not.be.undefined').then(() => {
            currentMessage = messageList.latestMessage;
            //TODO assert slugs are required
            cy.wrap({seriesManager}).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
                currentSeries = seriesManager.currentSeries;
                messageURL = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug.text}/${currentMessage.slug.text}`;
            });
        });

        cy.visit('/');
    });

    it('Tests Current Message title, description, and image', function () {
        cy.get('[data-automation-id="message-title"]').as('title');
        cy.get('@title').should('be.visible');
        Element.shouldContainText(cy.get('@title'), currentMessage.title);
        cy.get('@title').should('have.attr', 'href', messageURL);

        cy.get('[data-automation-id="message-description"]').as('description');
        cy.get('@description').should('be.visible');
        Element.shouldContainText(cy.get('@description'), currentMessage.description);

        cy.get('[data-automation-id="message-video"]').as('video');
        cy.get('@video').should('be.visible');
        cy.get('@video').should('have.attr', 'href', messageURL);
        Element.shouldHaveImgixImage(cy.get('@video').find('img'), currentMessage.image);
    });

    it('Test "View latest now" button link', function () {
        cy.get('[data-automation-id="watch-message-button"]').as('watchMessageButton');
        cy.get('@watchMessageButton').should('be.visible');
        cy.get('@watchMessageButton').should('have.attr', 'href', messageURL);
    });
});
