import {ContentfulApi} from '../../support/ContentfulApi';

describe('Testing the Latest Message on the Live page', function () {
    let messageList;
    before(function () {
        const content = new ContentfulApi();
        messageList = []
        content.retrieveListOfMessages(messageList, 5);
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
            .contains(messageList[index].imageFilename);
            expect(messageCard.find('[data-automation-id="recent-message-image"]')).to.have.attr('alt')
            .contains(messageList[index].title);

            expect(messageCard.find('[data-automation-id="recent-message-image-link"]')).to.have.attr('href')
            .contains(messageList[index].slug);
            expect(messageCard.find('[data-automation-id="recent-message-title"]')).to.have.text(messageList[index].title);
            expect(messageCard.find('[data-automation-id="recent-message-description"]')).to.contain(messageList[index].description);
        })
    }
})