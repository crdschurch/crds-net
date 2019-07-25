import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { MessageQueryManager } from 'crds-cypress-contentful';

describe('Testing the Current Message on the Homepage:', function () {
  let currentMessage;
  let relativeAutoplayURL;
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.getSingleEntry(mqm.query.latestMessage).then(message => {
      currentMessage = message;
      currentMessage.getURL().then(url => {
        relativeAutoplayURL = url.autoplay.relative;
      });
    });

    cy.ignorePropertyUndefinedTypeError();
    cy.visit('/');
  });

  it('Current Message title, description, and image should match Contentful', function () {
    cy.get('[data-automation-id="message-title"]').as('title');
    cy.get('@title').text().should('contain', currentMessage.title.text);
    cy.get('@title').should('have.attr', 'href', relativeAutoplayURL);

    cy.get('[data-automation-id="message-description"]').as('description');
    cy.get('@description').normalizedText().then(elementText =>{
      expect(currentMessage.description.unformattedText).to.include(elementText);
    });

    cy.get('[data-automation-id="message-video"]').as('videoImagelink');
    cy.get('@videoImagelink').should('have.attr', 'href', relativeAutoplayURL);

    cy.get('@videoImagelink').find('img').as('videoImage');
    currentMessage.imageLink.getResource(image => {
      new ImageDisplayValidator('videoImage', false).shouldHaveImgixImage(image);
    });
  });

  it('"View latest now" button should link to the current message', function () {
    cy.get('[data-automation-id="watch-message-button"]').as('watchMessageButton');
    cy.get('@watchMessageButton').should('be.visible');
    cy.get('@watchMessageButton').should('have.attr', 'href', relativeAutoplayURL);
  });
});
