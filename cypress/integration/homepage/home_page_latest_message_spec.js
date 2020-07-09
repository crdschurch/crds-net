import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { RequestFilter } from '../../Analytics/RequestFilter';
import { amplitude } from '../../fixtures/event_filters';
import { MessageQueryBuilder, normalizeText } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';

describe('Tests the Current Message on the Homepage', () => {
  let currentMessage;
  let requestFilter;

  before(() => {
    //Fetch Current Message
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.slug,fields.description,fields.image,fields.bitmovin_url';
    qb.limit = 1;
    cy.task('getCNFLResource', qb.queryParams)
      .then((message) =>{
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
    cy.get('.latest-message-headline').as('title')
      .scrollIntoView()
      .text()
      .should('contain', currentMessage.title.text);
      
    cy.get('.latest-message-btn').contains('View all teachings')
      .should('be.visible')
      .and('have.attr', 'href', '/media/series');

    getRelativeMessageUrl(currentMessage)
      .then((url) => {
        const autoplay = currentMessage.bitmovin_url ? 'true' : 'false';
        const relativeAutoplayURL = `${url}?autoPlay=${autoplay}&sound=11`;

        cy.get('[data-automation-id="message-video"]').as('videoImagelink')
          .should('exist')
          .and('have.attr', 'href', relativeAutoplayURL);

        cy.get('.latest-message-btn').contains('Watch now')
          .should('be.visible')
          .and('have.attr', 'href', relativeAutoplayURL);
      });    
  });

  it('Checks card image and, if Bitmovin video, player exists and video autoplays', () => {
    cy.get('[data-automation-id="message-video"]').as('videoImagelink');
    cy.get('@videoImagelink').find('img').as('videoImage');
    new ImageDisplayValidator('videoImage', false).shouldHaveImgixImage(currentMessage.image);

    if (currentMessage.bitmovin_url.hasValue) {
      cy.get('div[data-video-player]').as('videoPlayer').should('have.prop', 'id').and('contain', 'bitmovinPlayer');
      
      //TODO uncomment if autoplay is turned back on for this video - fix this
      // cy.wrap(requestFilter).as('autoplayEvent').its('matches').should('have.length', 1);
    }
  });

  it('Checks description', () => {
    cy.get('.latest-message-body')
      .as('description')
      .normalizedText()
      .then((elementText) => {
        expect(normalizeText(currentMessage.description.text)).to.have.string(elementText);
      });
  });
});
