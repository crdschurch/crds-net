import { AmplitudeEventChecker } from './helpers/AmplitudeEventChecker';
import { BitmovinPlayer } from './helpers/BitmovinPlayer';
import { StreamScheduleGenerator } from '../../support/StreamScheduleGenerator';
import { MessageQueryManager } from 'crds-cypress-contentful';

function hideRollCall() {
  localStorage.setItem('crds-roll-call-state', 'dismissed');
  cy.get('.roll-call').invoke('hide');
}

function getYoutubeId(youtubeURL) {
  const regex = /youtu(?:be|.be)?(?:.+)\/(?:.+v=)?(.{11})/;//TODO make not capture groups
  const match = regex.exec(youtubeURL)[1];
  expect(match).to.exist;
  return match;
}

describe('Tests the /live/stream page displays the expected player', function () {
  let latestMessage;
  let fakeSchedule;
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.getSingleEntry(mqm.query.latestMessage).then(message => {
      latestMessage = message;
    });

    fakeSchedule = new StreamScheduleGenerator().getStreamStartingAfterHours(0);
  });

  it('Displays the Bitmovin player or fallback Youtube player', function () {
    cy.server();
    cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeSchedule);
    cy.route('manifest.m3u8').as('bitmovinManifest');

    cy.visit('/live/stream/');
    hideRollCall();

    if (latestMessage.bitmovinURL.hasValue) {
      cy.get('#VideoManager').as('bitmovinPlayer').should('be.visible');
      cy.get('#js-media-video').as('youtubePlayer').should('not.exist');

      cy.wait('@bitmovinManifest', { timeout: 60000 }).then((manifest) => {
        expect(manifest.url).to.eq(latestMessage.bitmovinURL.text);
      });
    } else {
      cy.get('#js-media-video').as('youtubePlayer').should('be.visible');
      cy.get('#VideoManager').as('bitmovinPlayer').should('not.exist');

      if (latestMessage.youtubeURL.hasValue) {
        const youtubeId = getYoutubeId(latestMessage.youtubeURL.text);
        cy.get('@youtubePlayer').should('have.attr', 'video-id', youtubeId);
      }
    }
  });

  it('Autoplays the stream muted with subtitles if using Bitmovin player', function () {
    cy.server();
    cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeSchedule);
    const ampEvents = new AmplitudeEventChecker();

    cy.visit('/live/stream/');
    hideRollCall();

    if (latestMessage.bitmovinURL.hasValue) {
      ampEvents.waitForVideoEvents(['VideoStarted'], latestMessage.bitmovinURL.text, 3);

      const player = new BitmovinPlayer();
      player.waitUntilBuffered().then(() => {
        player.verifyPlayerMuted();
        if (latestMessage.hasSubtitles) {
          player.verifySubtitlesDisplayed();
        }
      });
    } else {
      ampEvents.failOnVideoEvent(['VideoStarted'], latestMessage.youtubeURL.text, 3);
    }
  });
});