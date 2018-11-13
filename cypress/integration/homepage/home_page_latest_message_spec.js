const moment = require('moment');
import {ContentfulApi, MessageModel} from '../../support/ContentfulApi';

describe("Testing the Latest Message on the Homepage", function () {
    let latestMessage;
    before(function () {
        const content = new ContentfulApi();
        latestMessage = new MessageModel();
        content.retrieveLatestMessage(latestMessage);
        cy.visit('');
    })

    it('Checks jumbotron latest message: title, image, date and links', function () {
        cy.get('[data-automation-id="last-message-card"] > a').then(($messageImage) => {
            expect($messageImage).to.have.attr('href').contains(latestMessage.slug);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('src').contains(latestMessage.imageFilename);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('srcset')
        })

        cy.get('[data-automation-id="last-message-card"] > div > a').then(($messageTitle) => {
            expect($messageTitle).to.have.attr('href').contains(latestMessage.slug);
            expect($messageTitle.find('#lastMessageTitle')).to.have.text(latestMessage.title);
        })

        const formattedDate = moment(latestMessage.publishedAt).format('MM.DD.YYYY');
        cy.get('#lastMessageSubtitle').should('have.text', formattedDate);
    })

    it('Checks latest message button link', function () {
        cy.get('[data-automation-id="latest-message-link"]').then(($messageButton) => {
            expect($messageButton).to.be.visible;
            expect($messageButton).to.have.attr('href').contains(latestMessage.slug);
        })
    })
});
