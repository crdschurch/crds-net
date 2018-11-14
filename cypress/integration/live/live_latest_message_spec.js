import {ContentfulApi} from '../../support/ContentfulApi';

describe("Checks latest message is correct on Live page", function () {
    let content;
    before(function () {
        content = new ContentfulApi();
        content.retrieveMessages();
        cy.visit('live');
    })

    it('does something', function() {
        cy.get('[data-automation-id="recent-message-card"]').as('messageCards').then(($cardList) =>
        {
            expect($cardList).lengthOf(4);
        })

        cy.get('@messageCards').each(($messageCard, index) =>{
            expect($messageCard).to.be.visible;
            expect($messageCard.find('[data-automation-id="recent-message-image"]')).to.have.attr('src')
            .contains(content.messages[index].imageFileName);
            expect($messageCard.find('[data-automation-id="recent-message-image"]')).to.have.attr('alt')
            .contains(content.messages[index].title);

            expect($messageCard.find('[data-automation-id="recent-message-image-link"]')).to.have.attr('href')
            .contains(content.messages[index].slug);
            expect($messageCard.find('[data-automation-id="recent-message-title"]')).to.have.text(content.messages[index].title);
            //TODO need to strip markdown from Contentful message before comparing
            //expect($messageCard.find('[data-automation-id="recent-message-description"]')).to.have.text(content.messages[index].description);
        })
    })
})