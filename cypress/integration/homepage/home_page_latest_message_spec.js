import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { RequestFilter } from '../../Analytics/RequestFilter';
import { amplitude } from '../../fixtures/event_filters';
import { MessageQueryManager } from 'crds-cypress-contentful';

describe('Tests the Current Message on the Homepage', function () {
  let currentMessage;
  let requestFilter;

  before(() => {
    //Fetch Current Message
    const mqm = new MessageQueryManager();
    mqm.getSingleEntry(mqm.query.latestMessage).then(message => {
      currentMessage = message;
    });

    //Setup capture for events
    cy.server();
    requestFilter = new RequestFilter(amplitude.isVideoStarted);
    cy.route({
      method: 'POST',
      url: 'api.amplitude.com',
      onResponse: (xhr) => {
        requestFilter.keepMatch(xhr.request);
      }
    });

    //Navigate
      cy.ignorePropertyUndefinedTypeError();
      cy.on('uncaught:exception', (err, runnable) => {
          return false
      })

    cy.visit('/');
  });

  it('Checks title, image, and "View latest now" button have correct link', () => {
    currentMessage.getURL().then(url => {
      const relativeAutoplayURL = url.autoplay.relative;

      cy.get('[data-automation-id="message-title"]').as('title');
      cy.get('@title').text().should('contain', currentMessage.title.text);
      cy.get('@title').should('have.attr', 'href', relativeAutoplayURL);

      cy.get('[data-automation-id="message-video"]').as('videoImagelink');
      cy.get('@videoImagelink').should('have.attr', 'href', relativeAutoplayURL);

      cy.get('[data-automation-id="watch-message-button"]').as('watchMessageButton');
      cy.get('@watchMessageButton').should('be.visible');
      cy.get('@watchMessageButton').should('have.attr', 'href', relativeAutoplayURL);
    });
  });

  it('Checks card image and, if Bitmovin video, player exists and video autoplays', () => {
  const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/, /.*Cannot set property staus or undefined.*/];
  cy.ignoreMatchingErrors(errorsToIgnore);  
    cy.get('[data-automation-id="message-video"]').as('videoImagelink');
    cy.get('@videoImagelink').find('img').as('videoImage');
    currentMessage.imageLink.getResource(image => {
      new ImageDisplayValidator('videoImage', false).shouldHaveImgixImage(image);
    });

    if (currentMessage.bitmovinURL.hasValue) {
      cy.get('div[data-video-player]').as('videoPlayer').should('have.prop', 'id').and('contain', 'bitmovinPlayer');

      cy.wrap(requestFilter).as('autoplayEvent').its('matches').should('have.length', 1);
    }
  });

  it('Checks description', function () {
    cy.get('[data-automation-id="message-description"]').as('description');
    cy.get('@description').normalizedText().then(elementText => {
      expect(currentMessage.description.unformattedText).to.include(elementText);
    });
  });
});
