
import { BitmovinPlayer } from './helpers/BitmovinPlayer';
import { StreamScheduleGenerator } from '../../support/StreamScheduleGenerator';
import { MessageQueryManager } from 'crds-cypress-contentful';
import { RequestFilter } from '../../Analytics/RequestFilter';
import { amplitude } from '../../fixtures/event_filters';

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

describe('Tests the /live/stream page video player', function () {
  let latestMessage;
  let fakeSchedule;
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.getSingleEntry(mqm.query.latestMessage).then(message => {
      latestMessage = message;
    });

    fakeSchedule = new StreamScheduleGenerator().getStreamStartingAfterHours(0);
  });

  beforeEach(() => {
    cy.server();
    cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeSchedule);
  });

  it('Checks player is Bitmovin player or fallback Youtube player', function () {
  //  cy.route('manifest.m3u8').as('bitmovinManifest');
    const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/, /.*Cannot set property staus or undefined.*/];
    cy.ignoreMatchingErrors(errorsToIgnore);
       cy.visit('/live/stream/');
    hideRollCall();

    if (latestMessage.bitmovinURL.hasValue) {
      cy.get('#VideoManager').as('bitmovinPlayer').should('be.visible');
      cy.get('#js-media-video').as('youtubePlayer').should('not.exist');

  //    cy.wait('@bitmovinManifest', { timeout: 60000 }).then((manifest) => {
 //       expect(manifest.url).to.eq(latestMessage.bitmovinURL.text);
   //   });
    } else {
      cy.get('#js-media-video').as('youtubePlayer').should('be.visible');
      cy.get('#VideoManager').as('bitmovinPlayer').should('not.exist');

      if (latestMessage.youtubeURL.hasValue) {
        const youtubeId = getYoutubeId(latestMessage.youtubeURL.text);
        cy.get('@youtubePlayer').should('have.attr', 'video-id', youtubeId);
      }
    }
  });
  
 // Skip test until live stream is returned back to original functionality 
  it.skip('Check Bitmovin player Autoplays muted with subtitles', function () {
    const requestFilter = new RequestFilter(amplitude.isVideoStarted);

    cy.route({
      method: 'POST',
      url: 'api.amplitude.com',
      onResponse: (xhr) => {
        requestFilter.keepMatch(xhr.request);
      }
    });

    const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/, /.*Cannot set property staus or undefined.*/];
    cy.ignoreMatchingErrors(errorsToIgnore);  
    cy.visit('/live/stream/');
    hideRollCall();

    if (latestMessage.bitmovinURL.hasValue) {

      const player = new BitmovinPlayer();
      player.waitUntilBuffered().then(() => {
        player.verifyPlayerMuted();
        if (latestMessage.hasSubtitles) {
          player.verifySubtitlesDisplayed();
        }
      });

      cy.wrap(requestFilter).as('autoplayEvent').its('matches').should('have.length', 1);
    } else {
      cy.wrap(requestFilter).as('autoplayEvent').its('matches').should('have.length', 0);
    }
  });
});