import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';
import { SeriesManager } from '../../Contentful/Models/SeriesModel';
import { MessageManager } from '../../Contentful/Models/MessageModel';

describe('Testing the Current Message on the Homepage:', function () {
  let currentMessage;
  let messageURL;
  before(function () {
    const messageManager = new MessageManager();
    messageManager.saveCurrentMessage();

    cy.wrap({ messageManager }).its('messageManager.currentMessage').should('not.be.undefined').then(() => {
      currentMessage = messageManager.currentMessage;
      new SeriesManager().saveMessageSeries(currentMessage);

      cy.wrap({ currentMessage }).its('currentMessage.series').should('not.be.undefined').then(() => {
        if(currentMessage.series === null){
          messageURL = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentMessage.slug.text}`;
        }
        else{
          messageURL = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentMessage.series.slug.text}/${currentMessage.slug.text}`;
        }
      });
    });

    cy.visit('/');
  });

  it('Current Message title, description, and image should match Contentful', function () {
    cy.get('[data-automation-id="message-title"]').as('title');
    Element.shouldContainText('title', currentMessage.title);
    cy.get('@title').should('have.attr', 'href', messageURL);

    cy.get('[data-automation-id="message-description"]').as('description');
    Element.shouldMatchSubsetOfText('description', currentMessage.description);

    cy.get('[data-automation-id="message-video"]').as('video');
    cy.get('@video').should('have.attr', 'href', messageURL);

    Element.shouldHaveImgixImageFindImg('video', currentMessage.image);
  });

  it('"View latest now" button should link to the current message', function () {
    cy.get('[data-automation-id="watch-message-button"]').as('watchMessageButton');
    cy.get('@watchMessageButton').should('be.visible');
    cy.get('@watchMessageButton').should('have.attr', 'href', messageURL);
  });
});
