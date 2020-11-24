import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';

const soundOn = 'sound=11';
const soundOff = 'sound=1';

describe('Tests message with Bitmovin player and transcription', function () {
  let relativeMessageURL;

  before(function () {
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug,fields.bitmovin_url';
    qb.searchFor = 'fields.bitmovin_url[exists]=true&fields.transcription[exists]=true&query=transcript-test';
    cy.task('getCNFLResource', qb.queryParams)
      .then(getRelativeMessageUrl)
      .then((url) => {
        relativeMessageURL = url;
      });
  });

  describe('Tests message autoplays and query params applied', () => {
    it('Checks sound is on and subtitles off', function () {
      cy.visit(`${relativeMessageURL}?autoPlay=true&${soundOn}`);

      cy.bufferingOverlay().should('be.hidden')
        .then(() => {
          cy.subtitleOverlay().should('not.exist');
          cy.unmutedIndicator().should('exist');
        });

      // Confirm autoplay has started by listening for the event
      cy.get('@analytics.track')
        .should('have.been.calledWith', 'VideoStarted');
    });

    it('Checks sound is off and subtitles on', function () {
      cy.visit(`${relativeMessageURL}?autoPlay=true&${soundOff}`);

      cy.bufferingOverlay().should('be.hidden')
        .then(() => {
          cy.mutedIndicator().should('exist');
          cy.subtitleSelect().find('option').should('have.length.gte', 2);
          cy.subtitleSelect().find('option[selected="selected"]').should('not.contain', 'off');
          cy.subtitleOverlay().should('exist').and('be.visible');
        });

      // Confirm autoplay has started by listening for the event
      cy.get('@analytics.track')
        .should('have.been.calledWith', 'VideoStarted');
    });
  });

  describe('Tests message does not autoplay if autoplay=false and query params ignored', () => {
    it('Checks when query param sets sound on', function () {
      cy.visit(`${relativeMessageURL}?autoPlay=false&${soundOn}`);

      cy.bufferingOverlay().should('be.hidden')
        .then(() => {
          cy.subtitleOverlay().should('not.exist');
          cy.unmutedIndicator().should('exist');
        });

      // Confirm autoplay event has not been sent
      cy.get('@analytics.track')
        .should('not.have.been.calledWith', 'VideoStarted');
    });

    it('Checks when query param sets sound off', function () {
      cy.visit(`${relativeMessageURL}?autoPlay=false&${soundOff}`);

      cy.bufferingOverlay().should('be.hidden')
        .then(() => {
          cy.subtitleOverlay().should('not.exist');
        });

      // Confirm autoplay event has not been sent
      cy.get('@analytics.track')
        .should('not.have.been.calledWith', 'VideoStarted');
    });
  });

  it('Checks message does not autoplay when there are no query params', function () {
    cy.visit(relativeMessageURL);

    cy.bufferingOverlay().should('be.hidden')
      .then(() => {
        cy.subtitleOverlay().should('not.exist');
      });

    // Confirm autoplay event has not been sent
    cy.get('@analytics.track')
      .should('not.have.been.calledWith', 'VideoStarted');
  });
});