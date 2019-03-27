import { ImageDisplayValidator } from '../../Contentful/ContentfulElementValidator';
import { MessageQueryManager } from '../../Contentful/QueryManagers/MessageQueryManager';

function check_message_card_content(index, message) {
  cy.get('[data-automation-id="recent-message-card"]').eq(index).as('messageCard');
  cy.get('@messageCard').should('be.visible');

  cy.get('@messageCard').find('[data-automation-id="recent-message-title"]').as('messageTitle');
  cy.get('@messageTitle').should('have.text', message.title.text);

  cy.get('@messageCard').find('[data-automation-id="recent-message-description"]').as('messageDescription');
  cy.get('@messageDescription').normalizedText().then(elementText => {
    expect(message.description.displayedText).to.include(elementText);
  });

  cy.get('@messageCard').find('[data-automation-id="recent-message-image-link"]').as('messageURL');
  cy.get('@messageURL').should('have.attr', 'href', message.URL.absolute);

  cy.get('@messageCard').find('[data-automation-id="recent-message-image"]').as('messageImage');
  cy.get('@messageImage').should('have.attr', 'alt').and('contain', message.title.text);
  new ImageDisplayValidator('messageImage').shouldHaveImgixImage(message.image);
}

//TODO Use cypress's syntax to repeat test with different variables
describe('Testing the Past Weekends section on the Live page:', function () {
  let recentMessages;
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.fetchRecentMessages(4).then(() => {
      recentMessages = mqm.queryResult;
      recentMessages.forEach(m => m.fetchLinkedResources());
    });
    cy.visit('/live');
  });

  it('Four messages should be displayed', function () {
    cy.get('[data-automation-id="recent-message-card"]').then(($cardList) => {
      expect($cardList).lengthOf(4);
    });
  });

  it('Most recent message card should contain title, image, description and link', function () {
    const index = 0;
    check_message_card_content(index, recentMessages[index]);
  });

  it('Second most recent message card should contain title, image, description and link', function () {
    const index = 1;
    check_message_card_content(index, recentMessages[index]);
  });

  it('Third most recent message card should contain title, image, description and link', function () {
    const index = 2;
    check_message_card_content(index, recentMessages[index]);
  });

  it('Fourth most recent message card should contain title, image, description and link', function () {
    const index = 3;
    check_message_card_content(index, recentMessages[index]);
  });
});

describe('Testing the "Watch This Weeks Service" button', function () {
  let currentMessage;
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.fetchLatestMessage().then(() => {
      currentMessage = mqm.queryResult;
      currentMessage.fetchLinkedResources();
    });
  });

  beforeEach(function () {
    cy.visit('/live');
  });

  it('Button should link to latest message', function () {
    cy.get('[data-automation-id="watch-service-button"]').should('be.visible').and('have.attr', 'href', currentMessage.URL.absolute);
  });

  it('When clicked, latest message page should load', function () {
    cy.get('[data-automation-id="watch-service-button"]').click();

    if (currentMessage.description.hasValue === true) {
      cy.get('#description').as('currentMessageDescription').should('be.visible');
      cy.get('@currentMessageDescription').normalizedText().then(elementText => {
        expect(currentMessage.description.displayedText).to.include(elementText);
      });
    }
  });
});