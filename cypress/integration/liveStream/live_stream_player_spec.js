import { MessageQueryManager } from '../../Contentful/QueryManagers/MessageQueryManager';
import { AmplitudeEventChecker } from './helpers/AmplitudeEventChecker';
import { BitmovinPlayer } from './helpers/BitmovinPlayer';

//TODO remove this once US17311 is comitted
Cypress.config({
  baseUrl: 'https://5cfa5f8b978a0d000a347d13--int-crds-net.netlify.com'
});

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
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.fetchLatestMessage().then(result => {
      latestMessage = result;
    });
  });

  it('Displays the Bitmovin player or fallback Youtube player', function () {
    cy.server();
    cy.route('/int/streamSchedule', 'fixture:current_stream_custom.json');//NOTE this fixture just needs some object in the "current" property - dates don't seem to matter
    cy.route('manifest.m3u8').as('bitmovinManifest');

    cy.visit('/live/stream-test/');
    hideRollCall();

    if (latestMessage.bitmovinURL.hasValue) {
      cy.get('#VideoManager').as('bitmovinPlayer').should('be.visible');
      cy.get('#js-media-video').as('youtubePlayer').should('not.exist');

      cy.wait('@bitmovinManifest').then((manifest) => {
        expect(manifest.url).to.eq(latestMessage.bitmovinURL.text);
      });
    } else if (latestMessage.youtubeURL.hasValue) {
      //TODO Uncomment and test when US17317 is committed
      // cy.get('#js-media-video').as('youtubePlayer').should('be.visible');
      // cy.get('#VideoManager').as('bitmovinPlayer').should('not.exist');

      // const youtubeId = getYoutubeId(latestMessage.youtubeURL.text);
      // cy.get('@youtubePlayer').should('have.attr', 'video-id', youtubeId);
    } else {
      assert.isTrue(false, 'Latest message should have a Bitmovin URL or YouTube URL, but it does not');
    }
  });

  it('Autoplays the stream muted with subtitles', function () {
    cy.server();
    cy.route('/int/streamSchedule', 'fixture:current_stream_custom.json');
    const ampEvents = new AmplitudeEventChecker();

    cy.visit('/live/stream-test/'); //stream-test should be valid in builds from now on
    hideRollCall();

    if (latestMessage.bitmovinURL.hasValue) {
      //ampEvents.waitForVideoEvents(['VideoStarted'], latestMessage.bitmovinURL.text, 3); //TODO Uncomment and test when US17311 is committed

      const player = new BitmovinPlayer();
      player.waitUntilBuffered().then(() => {
        player.verifySubtitlesDisplayed();
        player.verifyPlayerMuted();
      });
    } else if (latestMessage.youtubeURL.hasValue) {
      //ampEvents.waitForVideoEvents(['VideoStarted'], latestMessage.youtubeURL.text, 3); //TODO Uncomment and test when US17311 is committed
    } else {
      assert.isTrue(false, 'Latest message should have a Bitmovin URL or YouTube URL, but it does not');
    }
  });
});