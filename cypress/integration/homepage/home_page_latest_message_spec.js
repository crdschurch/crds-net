import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { RequestFilter } from '../../Analytics/RequestFilter';
import { amplitude } from '../../fixtures/event_filters';
import { MessageQueryManager } from 'crds-cypress-contentful';

describe('Tests the Current Message on the Homepage', () => {
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

    cy.visit('/');
  });

  it('Checks title, image, and button have correct link', () => {
    currentMessage.getURL().then(url => {
      const relativeAutoplayURL = url.autoplay.relative;

      cy.get('.latest-message-headline').as('title')
        .scrollIntoView({ top: 10 })
        .text().should('contain', currentMessage.title.text);

      cy.get('[data-automation-id="message-video"]').as('videoImagelink')
        .should('have.attr', 'href', relativeAutoplayURL);

      cy.get('.latest-message-btn').contains('Watch now')
        .should('be.visible')
        .and('have.attr', 'href', relativeAutoplayURL);

      cy.get('.latest-message-btn').contains('View all teachings')
        .should('be.visible')
        .and('have.attr', 'href', '/media/series');
    });
  });

  it('Checks card image and, if Bitmovin video, player exists and video autoplays', () => {
    cy.get('[data-automation-id="message-video"]').as('videoImagelink');
    cy.get('@videoImagelink').find('img').as('videoImage');
    currentMessage.imageLink.getResource(image => {
      new ImageDisplayValidator('videoImage', false).shouldHaveImgixImage(image);
    });

    if (currentMessage.bitmovinURL.hasValue) {
      cy.get('div[data-video-player]').as('videoPlayer').should('have.prop', 'id').and('contain', 'bitmovinPlayer');
      
      //TODO uncomment if autoplay is turned back on for this video
      // cy.wrap(requestFilter).as('autoplayEvent').its('matches').should('have.length', 1);
    }
  });

  it('Checks description', () => {
    cy.get('.latest-message-body')
      .as('description')
      .normalizedText().then(elementText => {
        expect(currentMessage.description.unformattedText).to.include(elementText);
      });
  });
});
