import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../support/Cypress/ContentfulElementValidator';

function check_message_card_content(cardElement, message) {
    cardElement.then(($cardContent) => {
        expect($cardContent).to.be.visible;
        expect($cardContent.find('[data-automation-id="recent-message-image"]')).to.have.attr('src')
            .contains(message.image.id);
        expect($cardContent.find('[data-automation-id="recent-message-image"]')).to.have.attr('alt')
            .contains(message.title.text);

        expect($cardContent.find('[data-automation-id="recent-message-image-link"]')).to.have.attr('href')
            .contains(message.slug.text);
        expect($cardContent.find('[data-automation-id="recent-message-title"]')).to.have.text(message.title.text);
    });

    Element.shouldContainText(cardElement.find('[data-automation-id="recent-message-description"]'), message.description.text);
}

describe('Testing the Past Weekends section on the Live page:', function () {
    let messageList;
    before(function () {
        const content = new ContentfulApi();
        messageList = content.retrieveListOfMessages(5);

        cy.wrap({messageList}).its('messageList.latestMessage').should('not.be.undefined').then(() => {
            cy.visit('live/');
        });
    });

    it('Four messages should be displayed', function(){
        cy.get('[data-automation-id="recent-message-card"]').then(($cardList) =>
        {
            expect($cardList).lengthOf(4);
        });
    });

    it('Most recent message card should contain title, image, description and link', function(){
        const index = 0;
        cy.get('[data-automation-id="recent-message-card"]').eq(index).as('firstMessage');
        check_message_card_content(cy.get('@firstMessage'), messageList.message(index));
    });

    it('Second most recent message card should containtitle, image, description and link', function(){
        const index = 1;
        cy.get('[data-automation-id="recent-message-card"]').eq(index).as('secondMessage');
        check_message_card_content(cy.get('@secondMessage'), messageList.message(index));
    });

    it('Third most recent message card should containtitle, image, description and link', function(){
        const index = 2;
        cy.get('[data-automation-id="recent-message-card"]').eq(index).as('thirdMessage');
        check_message_card_content(cy.get('@thirdMessage'), messageList.message(index));
    });

    it('Fourth most recent message card should containtitle, image, description and link', function(){
        const index = 3;
        cy.get('[data-automation-id="recent-message-card"]').eq(index).as('fourthMessage');
        check_message_card_content(cy.get('@fourthMessage'), messageList.message(index));
    });
});