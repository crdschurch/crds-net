const moment = require('moment');
import {ContentfulApi, MessageModel} from '../../support/ContentfulApi';

describe("Checks latest message is correct on Home page", function () {
    let messages;
    before(function () {
        const content = new ContentfulApi();
        messages = new MessageModel();
        content.retrieveMessages(messages, 1);
        cy.visit('');
    })

    it('Checks jumbotron latest message: title, image, date and links', function () {
        cy.get('[data-automation-id="last-message-card"] > a').then(($messageImage) => {
            expect($messageImage).to.have.attr('href').contains(messages.latestMessage.slug);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('src').contains(messages.latestMessage.imageFileName);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('srcset')
        })

        cy.get('[data-automation-id="last-message-card"] > div > a').then(($messageTitle) => {
            expect($messageTitle).to.have.attr('href').contains(messages.latestMessage.slug);
            expect($messageTitle.find('#lastMessageTitle')).to.have.text(messages.latestMessage.title);
        })

        const formattedDate = moment(messages.latestMessage.published_at).format('MM.DD.YYYY');
        cy.get('#lastMessageSubtitle').should('have.text', formattedDate);
    })

    it('Checks latest message button link', function () {
        cy.get('[data-automation-id="latest-message-link"]').then(($messageButton) => {
            expect($messageButton).to.be.visible;
            expect($messageButton).to.have.attr('href').contains(messages.latestMessage.slug);
        })
    })
});
