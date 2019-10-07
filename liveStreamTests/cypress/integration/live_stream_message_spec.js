import { MessageQueryManager } from 'crds-cypress-contentful';
import { StreamScheduleGenerator } from './helpers/ScheduleGenerator';
import { RequestFilter } from '../Analytics/RequestFilter';
import { amplitude } from '../fixtures/event_filters';
import moment from 'moment';
import 'moment-timezone';

/** Helper functions */
function getLatestDate(dayOfWeek = 'Saturday', timeOfDay = '12:00AM') {
  const momentZone = 'America/New_York';
  const now = moment.tz(momentZone);
  let latestTimeOnDay = moment.tz(timeOfDay, 'hh:mmA', momentZone).day(dayOfWeek);
  latestTimeOnDay = latestTimeOnDay.isAfter(now) ? latestTimeOnDay.subtract(7, 'days') : latestTimeOnDay;
  return latestTimeOnDay;
}

function hideRollCall() {
  localStorage.setItem('crds-roll-call-state', 'dismissed');
  cy.get('.roll-call').invoke('hide');
}

/** Tests */
describe('Tests latest message is current and ready for live stream', function () {
  let contentfulLatestMessage;
  let fakeSchedule;
  before(function () {
    const mqm = new MessageQueryManager();
    mqm.getSingleEntry(mqm.query.latestMessage).then(message => {
      contentfulLatestMessage = message;
    });

    fakeSchedule = new StreamScheduleGenerator().getStreamStartingAfterHours(0);
  });

  it('Verify encoding is ready for the latest message in Bitmovin', function () {
    cy.request(`${Cypress.env('CROSSROADS_API_ENDPOINT')}/video-service/encode/latestMessageStatus`).then(response => {
      const latestMessageStatus = response.body;

      //Encodings should be finished
      assert.equal(latestMessageStatus.encodingStatus, 'FINISHED', `Expect the latest message video's encoding status to be 'FINISHED', and status is '${latestMessageStatus.encodingStatus}'.`);
      assert.equal(latestMessageStatus.manifestStatus, 'FINISHED', `Expect the latest message manifest creation status to be 'FINISHED', and status is '${latestMessageStatus.manifestStatus}'.`);

      //Latest message according to Bitmovin should match Contentful
      assert.equal(latestMessageStatus.messageId, contentfulLatestMessage.id, `Expect the latest message known to Bitmovin to match the latest message in Contentful. Bitmovin's latest message id is '${latestMessageStatus.messageId}' and Contentful's latest message id is '${contentfulLatestMessage.id}'`);
      assert.equal(latestMessageStatus.videoId, contentfulLatestMessage.videoLink.id, `Expect the latest message's video id in Bitmovin to match the video id in Contentful. Bitmovin's video id is '${latestMessageStatus.videoId}' and Contentful's video id is '${contentfulLatestMessage.videoLink.id}'`);
      assert.equal(latestMessageStatus.messageBitmovinUrl, contentfulLatestMessage.bitmovinURL.toString, `Expect the latest message's Bitmovin url to be the same in Bitmovin and Contentful. Bitmovin's latest message url is '${latestMessageStatus.messageBitmovinUrl}' and in Contentful is '${contentfulLatestMessage.bitmovinURL.toString}'`);
    });
  });

  it('Verify the message for this week\'s live stream has been published', function () {
    //Message should be published after the latests Saturday service
    const publishedDate = moment(contentfulLatestMessage.publishedAt.toString);
    const earliestPublishableDate = getLatestDate('Saturday', '12:00AM');
    assert.isTrue(publishedDate.isSameOrAfter(earliestPublishableDate), `Expect latest message to be published after ${earliestPublishableDate}. It was published ${publishedDate}`);

    //Message should have Bitmovin URL
    assert.isTrue(contentfulLatestMessage.bitmovinURL.hasValue, `Expect latest message to have a Bitmovin URL, and it is ${contentfulLatestMessage.bitmovinURL.toString}`);
  });

  it('Verify the new message is streamed using the Bitmovin player', function () {
    //Trick /live to think the live stream is playing
    cy.server();
    cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeSchedule);
    cy.route('manifest.m3u8').as('bitmovinManifest');

    //Listen for video started event
    const requestFilter = new RequestFilter(amplitude.isVideoStarted);
    cy.route({
      method: 'POST',
      url: 'api.amplitude.com',
      onResponse: (xhr) => {
        requestFilter.keepMatch(xhr.request);
      }
    });

    //Navigate to live stream
    cy.visit('/live/stream/');
    hideRollCall();

    //Bitmovin player should be visible
    cy.get('#VideoManager').as('bitmovinPlayer').should('be.visible');
    cy.get('#js-media-video').as('youtubePlayer').should('not.exist');

    //Latest message should be streaming
    cy.wait('@bitmovinManifest', {timeout: 60000}).then((manifest) => {
      assert.equal(manifest.url, contentfulLatestMessage.bitmovinURL.toString, `Expect the live stream to play the latest message which has Bitmovin URL '${contentfulLatestMessage.bitmovinURL.toString}'. Stream is playing message from '${manifest.url}'`);
    });

    //Stream should be autoplayed
    cy.wrap(requestFilter).its('matches').should('have.length', 1);
  });
});

/** Using the "after" hook or listening for events sometimes doesn't send messages due to bugs in Cypress (issue #2831)
 * This is a hacky but reliable way to get around the issue.
*/
// describe('Sends out results', function () {
//   it('Sends out Slack and Email alerts', function() {
//     cy.reportResultsToSlack();
//     cy.reportResultsByEmail();
//   });
// });