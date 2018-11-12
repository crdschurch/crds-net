import {ContentfulApi, MessageModel} from '../../support/ContentfulApi';

describe("Checks latest message is correct on Live page", function () {
    let messages;
    before(function () {
        const content = new ContentfulApi();
        messages = new MessageModel();
        content.retrieveMessages(messages, 5);
        cy.visit('live');
    })

    it('Checks Past Weekend section displays 4 recent messages', function(){
        cy.get('[data-automation-id="recent-message-card"]').then(($cardList) =>
        {
            expect($cardList).lengthOf(4);
        })
    })

    it('Checks most recent message content', function(){
        check_message_card_content_at_index(0);
    })

    it('Checks second most recent message content', function(){
        check_message_card_content_at_index(1);
    })

    it('Checks third most recent message content', function(){
        check_message_card_content_at_index(2);
    })

    it('Checks fourth most recent message content', function(){
        check_message_card_content_at_index(3);
    })

    function check_message_card_content_at_index(index) {
        cy.get('[data-automation-id="recent-message-card"]').eq(index).then((messageCard) => {
            expect(messageCard).to.be.visible;
            expect(messageCard.find('[data-automation-id="recent-message-image"]')).to.have.attr('src')
            .contains(messages.messages[index].imageFileName);
            expect(messageCard.find('[data-automation-id="recent-message-image"]')).to.have.attr('alt')
            .contains(messages.messages[index].title);

            expect(messageCard.find('[data-automation-id="recent-message-image-link"]')).to.have.attr('href')
            .contains(messages.messages[index].slug);
            expect(messageCard.find('[data-automation-id="recent-message-title"]')).to.have.text(messages.messages[index].title);
            expect(messageCard.find('[data-automation-id="recent-message-description"]')).to.contain(messages.messages[index].description);
        })
    }
})