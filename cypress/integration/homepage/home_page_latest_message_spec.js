const moment = require('moment');
import {ContentfulApi} from '../../support/Contentful/ContentfulApi';

describe.skip("Testing the Latest Message on the Homepage", function () {
    let latestMessage;
    before(function () {
        const content = new ContentfulApi();
        latestMessage = content.retrieveLatestMessage();
        cy.visit('');
    })

    it('Tests Jumbotron latest message title, title link and date', function(){
        cy.get('[data-automation-id="last-message-card"] > div > a').then(($messageTitle) => {
            expect($messageTitle).to.have.attr('href').contains(latestMessage.slug);
            expect($messageTitle.find('#lastMessageTitle')).to.have.text(latestMessage.title);
        })

        const formattedDate = moment(latestMessage.publishedAt).format('MM.DD.YYYY');
        cy.get('#lastMessageSubtitle').should('have.text', formattedDate);
    })

    it('Tests Jumbotron latest message image and image link', function(){
        cy.get('[data-automation-id="last-message-card"] > a').then(($messageImage) => {
            expect($messageImage).to.have.attr('href').contains(latestMessage.slug);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('src').contains(latestMessage.imageId);
            expect($messageImage.find('#lastMessageImg > img')).to.have.attr('srcset')
        })
    })

    it('Test "View latest now" button link', function () {
        cy.get('[data-automation-id="latest-message-link"]').then(($messageButton) => {
            expect($messageButton).to.be.visible;
            expect($messageButton).to.have.attr('href').contains(latestMessage.slug);
        })
    })
});
