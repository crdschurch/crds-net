import { ContentfulLibrary } from 'crds-cypress-tools';
import { ExtendedMessageEntry } from '../../Contentful/Entries/ExtendedMessageEntry';
import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';

describe('Testing the Past Weekends section on the Live page:', function () {
  let recentMessages;
  before(function () {
    const mqm = new ContentfulLibrary.queryManager.messageQueryManager();
    mqm.entryClass = ExtendedMessageEntry;
    mqm.fetchListOfEntries(mqm.query.latestMessage, 4).then(messageList => {
      recentMessages = messageList;
      recentMessages.forEach(m => m.fetchLinkedResources());
    });

    cy.visit('/live');
  });

  it('Four messages should be displayed', function () {
    cy.get('[data-automation-id="recent-message-card"]').then(($cardList) => {
      expect($cardList).lengthOf(4);
    });
  });

  [0,1,2,3].forEach((index) => {
    it(`The card for message #${index} should contain title, image, description and link`, function () {
      const message = recentMessages[index];
      cy.get('[data-automation-id="recent-message-card"]').eq(index).as('messageCard');
      cy.get('@messageCard').should('be.visible');

      cy.get('@messageCard').find('[data-automation-id="recent-message-title"]').as('messageTitle');
      cy.get('@messageTitle').should('have.text', message.title.text);

      cy.get('@messageCard').find('[data-automation-id="recent-message-description"]').as('messageDescription');
      cy.get('@messageDescription').normalizedText().then(elementText => {
        expect(message.description.displayedText).to.include(elementText);
      });

      cy.get('@messageCard').find('[data-automation-id="recent-message-image-link"]').as('messageURL');
      cy.get('@messageURL').should('have.attr', 'href', message.autoplayURL.relative);

      cy.get('@messageCard').find('[data-automation-id="recent-message-image"]').as('messageImage');
      cy.get('@messageImage').should('have.attr', 'alt').and('contain', message.title.text);
      new ImageDisplayValidator('messageImage', false).shouldHaveImgixImage(message.image);
    });
  });
});

describe('Testing the "Watch This Weeks Service" button', function () {
  let currentMessage;
  before(function () {
    const mqm = new ContentfulLibrary.queryManager.messageQueryManager();
    mqm.entryClass = ExtendedMessageEntry;
    mqm.fetchSingleEntry(mqm.query.latestMessage).then(message => {
      currentMessage = message;
      currentMessage.fetchLinkedResources();
    });
  });

  beforeEach(function () {
    cy.visit('/live');
    cy.hideSharedHeader();
  });

  it('Button should link to latest message', function () {
    cy.get('[data-automation-id="watch-service-button"]').should('be.visible').and('have.attr', 'href', currentMessage.autoplayURL.relative);
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