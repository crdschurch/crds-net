import { MessageQueryManager } from '../../Contentful/QueryManagers/MessageQueryManager';
import { AmplitudeEventChecker } from './helpers/AmplitudeEventChecker';
import { BitmovinPlayer } from './helpers/BitmovinPlayer';
import { StreamScheduleGenerator } from './helpers/ScheduleGenerator';

function hideRollCall() {
  localStorage.setItem('crds-roll-call-state', 'dismissed');
  cy.get('.roll-call').invoke('hide');
}

function getYoutubeId(youtubeURL) {
  const regex = '\\w+://\\S+/(?:watch\\?v=)?(\\w{11}).*';
  const match = new RegExp(regex).exec(youtubeURL);
  return match[1];
}

describe('Tests the /live/stream page displays the expected player', function () {
  let latestMessage;
  let fakeSchedule;
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.fetchLatestMessage().then(result => {
      latestMessage = result;
    });

    fakeSchedule = new StreamScheduleGenerator().streamStartingNow;
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

      cy.wait('@bitmovinManifest', {timeout: 30000}).then((manifest) => {
        expect(manifest.url).to.eq(latestMessage.bitmovinURL.text);
      });
    } else {
      cy.get('#js-media-video').as('youtubePlayer').should('be.visible');
      cy.get('#VideoManager').as('bitmovinPlayer').should('not.exist');

      if(latestMessage.youtubeURL.hasValue) {
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
        player.verifySubtitlesDisplayed();
        player.verifyPlayerMuted();
      });
    } else {
      ampEvents.failOnVideoEvent(['VideoStarted'], latestMessage.youtubeURL.text, 3);
    }
  });
});