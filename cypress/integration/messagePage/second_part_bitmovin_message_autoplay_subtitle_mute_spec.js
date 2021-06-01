import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';
const errorsToIgnore = [/.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/];

const soundOn = 'sound=11';
const soundOff = 'sound=1';

describe('Tests message with Bitmovin player without transcription', function () {
  let relativeMessageUrl;

  before(function () {
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug,fields.bitmovin_url';
    qb.searchFor = 'fields.bitmovin_url[exists]=true&fields.transcription[exists]=false';
    cy.task('getCNFLResource', qb.queryParams)
      .then(getRelativeMessageUrl)
      .then((url) => {
        relativeMessageUrl = url;
      });
  });

  describe('Tests message autoplays and query params applied', () => {
    it('Checks sound is on and subtitles off', function () {
      cy.ignoreMatchingErrors(errorsToIgnore);
      cy.visit(`${relativeMessageUrl}?autoPlay=true&${soundOn}`);

      cy.bufferingOverlay().should('be.hidden')
        .then(() => {
          cy.subtitleOverlay().should('not.exist');
          cy.unmutedIndicator().should('exist');
        });

      // Confirm autoplay has started by listening for the event
      cy.get('@analytics.track')
        .should('have.been.calledWith', 'VideoStarted');
    });

    it('Checks sound and subtitles off', function () {
      cy.ignoreMatchingErrors(errorsToIgnore);
      cy.visit(`${relativeMessageUrl}?autoPlay=true&${soundOff}`);

      cy.bufferingOverlay().should('be.hidden')
        .then(() => {
          cy.subtitleOverlay().should('not.exist');
          cy.mutedIndicator().should('exist');
        });

      // Confirm autoplay has started by listening for the event
      cy.get('@analytics.track')
        .should('have.been.calledWith', 'VideoStarted');
    });
  });

  describe('Tests message does not autoplay if autoplay=false and query params ignored', () => {
    it('Checks when query param sets sound on', function () {
      cy.ignoreMatchingErrors(errorsToIgnore);
      cy.visit(`${relativeMessageUrl}?autoPlay=false&${soundOn}`);

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
      cy.ignoreMatchingErrors(errorsToIgnore);
      cy.visit(`${relativeMessageUrl}?autoPlay=false&${soundOff}`);

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
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit(relativeMessageUrl);

    cy.bufferingOverlay().should('be.hidden')
      .then(() => {
        cy.subtitleOverlay().should('not.exist');
      });

    // Confirm autoplay event has not been sent
    cy.get('@analytics.track')
      .should('not.have.been.calledWith', 'VideoStarted');
  });
});