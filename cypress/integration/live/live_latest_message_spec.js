import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';
import { MessageManager } from '../../Contentful/Models/MessageModel';

function check_message_card_content(index, message) {
  cy.get('[data-automation-id="recent-message-card"]').eq(index).as('messageCard');
  cy.get('@messageCard').should('be.visible');

  cy.get('@messageCard').find('[data-automation-id="recent-message-title"]').as('messageTitle');
  cy.get('@messageTitle').should('contain', message.title.text);

  cy.get('@messageCard').find('[data-automation-id="recent-message-description"]').as('messageDescription');
  Element.shouldContainText('messageDescription', message.description.text);

  cy.get('@messageCard').find('[data-automation-id="recent-message-image-link"]').as('messageURL');
  cy.get('@messageURL').should('have.attr', 'href').and('contain', message.slug.text);

  cy.get('@messageCard').find('[data-automation-id="recent-message-image"]').as('messageImage');
  cy.get('@messageImage').should('have.attr', 'alt').and('contain', message.title.text);
  Element.shouldHaveImgixImage('messageImage', message.image);
}

describe('Testing the Past Weekends section on the Live page:', function () {
  let messageManager;
  before(function () {
    messageManager = new MessageManager();
    messageManager.saveRecentMessages(4);

    cy.wrap({ messageManager }).its('messageManager.currentMessage').should('not.be.undefined').then(() => {
      cy.visit('/live');
    });
  });

  it('Four messages should be displayed', function () {
    cy.get('[data-automation-id="recent-message-card"]').then(($cardList) => {
      expect($cardList).lengthOf(4);
    });
  });

  it('Most recent message card should contain title, image, description and link', function () {
    const index = 0;
    check_message_card_content(index, messageManager.getRecentMessageByIndex(index));
  });

  it('Second most recent message card should containtitle, image, description and link', function () {
    const index = 1;
    check_message_card_content(index, messageManager.getRecentMessageByIndex(index));
  });

  it('Third most recent message card should containtitle, image, description and link', function () {
    const index = 2;
    check_message_card_content(index, messageManager.getRecentMessageByIndex(index));
  });

  it('Fourth most recent message card should containtitle, image, description and link', function () {
    const index = 3;
    check_message_card_content(index, messageManager.getRecentMessageByIndex(index));
  });
});