const moment = require('moment');
import {ContentfulApi} from '../../support/ContentfulApi';

describe("Checks latest message is correct on Home page", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveMessages();
        cy.visit('');
    })

    it('Checks jumbotron latest message: title, image, date and links', function () {
        cy.get('[data-automation-id="last-message-card"] > a').then(($messageImage) => {
            expect($messageImage).to.have.attr('href').contains(content.latestMessage.slug);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('src').contains(content.latestMessage.imageFileName);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('srcset')
        })

        cy.get('[data-automation-id="last-message-card"] > div > a').then(($messageTitle) => {
            expect($messageTitle).to.have.attr('href').contains(content.latestMessage.slug);
            expect($messageTitle.find('#lastMessageTitle')).to.have.text(content.latestMessage.title);
        })

        const formattedDate = moment(content.latestMessage.published_at).format('MM.DD.YYYY');
        cy.get('#lastMessageSubtitle').should('have.text', formattedDate);
    })

    it('Checks latest message button link', function () {
        cy.get('[data-automation-id="latest-message-link"]').then(($messageButton) => {
            expect($messageButton).to.be.visible;
            expect($messageButton).to.have.attr('href').contains(content.latestMessage.slug);
        })
    })
});
