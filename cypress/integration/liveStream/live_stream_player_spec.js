
import { BitmovinPlayer } from './helpers/BitmovinPlayer';
import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { RequestFilter } from '../../Analytics/RequestFilter';
import { amplitude } from '../../fixtures/event_filters';
import { getStreamSchedule } from '../../fixtures/stream_schedule_response';

function hideRollCall() {
  localStorage.setItem('crds-roll-call-state', 'dismissed');
  cy.get('.roll-call').invoke('hide');
}

function getYoutubeId(youtubeURL) {
  const regex = /youtu(?:be|.be)?(?:.+)\/(?:.+v=)?(.{11})/;
  const match = regex.exec(youtubeURL)[1];
  expect(match).to.exist;
  return match;
}

describe('Tests the /live/stream page video player', function() {
  const fakeSchedule = getStreamSchedule(0);
  let latestMessage;

  before(function() {
    // Get current message
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug,fields.bitmovin_url,fields.source_url,fields.transcription';
    cy.task('getCNFLResource', qb.queryParams)
      .then((message) => {
        latestMessage = message;
      });
  });

  beforeEach(function() {
    cy.server();
    cy.route(`${Cypress.env('stream_schedule_env')}/streamSchedule`, fakeSchedule);
  });

  it('Checks player is Bitmovin player or fallback Youtube player', function() {
    cy.route('manifest.m3u8').as('bitmovinManifest');

    cy.visit('/live/stream/');
    hideRollCall();

    if (latestMessage.bitmovin_url) {
      cy.get('#VideoManager').as('bitmovinPlayer')
        .should('be.visible');
      cy.get('#js-media-video').as('youtubePlayer')
        .should('not.exist');

      // Autoplay is turned off. Uncomment when it's turned back on
      // cy.wait('@bitmovinManifest', { timeout: 60000 }).then((manifest) => {
      //   expect(manifest.url).to.eq(latestMessage.bitmovin_url.text);
      // });
    } else {
      cy.get('#js-media-video').as('youtubePlayer')
        .should('be.visible');
      cy.get('#VideoManager').as('bitmovinPlayer')
        .should('not.exist');

      if (latestMessage.source_url) {
        const youtubeId = getYoutubeId(latestMessage.source_url.text);
        cy.get('@youtubePlayer')
          .should('have.attr', 'video-id', youtubeId);
      }
    }
  });

  // Skip test until live stream autoplay is turned back on
  it.skip('Check Bitmovin player Autoplays muted with subtitles', function() {
    const requestFilter = new RequestFilter(amplitude.isVideoStarted);

    cy.route({
      method: 'POST',
      url: 'api.amplitude.com',
      onResponse: (xhr) => {
        requestFilter.keepMatch(xhr.request);
      }
    });

    cy.visit('/live/stream/');
    hideRollCall();

    if (latestMessage.bitmovin_url) {
      const player = new BitmovinPlayer();
      player.waitUntilBuffered().then(function() {
        player.verifyPlayerMuted();
        if (latestMessage.transcription) {
          player.verifySubtitlesDisplayed();
        }
      });

      cy.wrap(requestFilter).as('autoplayEvent')
        .its('matches').should('have.length', 1);
    } else {
      cy.wrap(requestFilter).as('autoplayEvent')
        .its('matches').should('have.length', 0);
    }
  });
});