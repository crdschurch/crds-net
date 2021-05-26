import { MessageQueryBuilder, normalizeText } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';

describe('Tests the Current Message on the Homepage', function() {
  // const requestFilter = new RequestFilter(amplitude.isVideoStarted);
  let currentMessage;  
  const importDeclarationsError = /.*> Cannot set property 'status' of undefined*/;

  before(function() {
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.slug,fields.description,fields.image,fields.bitmovin_url';
    cy.task('getCNFLResource', qb.queryParams)
      .then((message) => {
        currentMessage = message;
        cy.ignoreMatchingErrors([importDeclarationsError]);
      });

    //Setup capture for events
    // cy.server();
    // cy.route({
    //   method: 'POST',
    //   url: 'api.amplitude.com',
    //   onResponse: (xhr) => {
    //     requestFilter.keepMatch(xhr.request);
    //   }
    // });
    cy.ignoreMatchingErrors([importDeclarationsError]);
    cy.visit('/');
    });

  it('Checks title, image, and button have correct link', function() {
    cy.get('.latest-message-headline').as('title')
      .scrollIntoView()
      //.text()
      .should('contain', currentMessage.title.text);

    cy.get('.latest-message-btn').contains('View all teachings')
      .should('be.visible')
      .and('have.attr', 'href', '/media/series');

    getRelativeMessageUrl(currentMessage)
      .then((url) => {
        const autoplay = currentMessage.bitmovin_url ? 'true' : 'false';
        const relativeAutoplayURL = `/media${url}?autoPlay=${autoplay}&sound=11`;

        cy.get('[data-automation-id="message-video"]').as('videoImagelink')
          .should('exist')
          .and('have.attr', 'href', relativeAutoplayURL);

        cy.get('.latest-message-btn').contains('Watch now')
          .should('be.visible')
          .and('have.attr', 'href', relativeAutoplayURL);
      });
  });

  it('Checks description', function() {
    cy.get('.latest-message-body')
      .as('description')
      .normalizedText()
      .then((elementText) => {
        expect(normalizeText(currentMessage.description.text)).to.have.string(elementText);
      });
  });

  it('Checks card image and, if Bitmovin video, player exists and video autoplays', function() {
    cy.visit('/'); //Revisit to confirm analytics event
    cy.get('[data-automation-id="message-video"]').as('currentMessageVideo')
      .scrollIntoView()
      .within(() => {
        cy.imgixShouldRunOnElement('img', currentMessage.image);
      });

    if (currentMessage.bitmovin_url.hasValue) {
      cy.get('div[data-video-player]').as('videoPlayer')
        .should('have.prop', 'id').and('contain', 'bitmovinPlayer');
    //  cy.wait(3000);
      // Confirm autoplay has started by listening for the event
      cy.get('@analytics.track',{ timeout: 50000 })
        .should('have.been.calledWith', 'VideoStarted');
    }
  });
});