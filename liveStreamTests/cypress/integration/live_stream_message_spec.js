import { ContentfulLibrary } from 'crds-cypress-tools';
import { AmplitudeEventChecker } from './helpers/AmplitudeEventChecker';
import { StreamScheduleGenerator } from './helpers/ScheduleGenerator';
import moment from 'moment';
import 'moment-timezone';

/** Extended Contentful Models */
class VideoAsset {
  constructor (videoObject) {
    this._video_object = videoObject !== undefined ? videoObject : {};
  }

  get id() {
    return this._video_object.sys !== undefined ? this._video_object.sys.id : undefined;
  }
}

class ExtendedMessageEntry extends ContentfulLibrary.entry.message {
  constructor (entryObject, seriesEntry) {
    super(entryObject, seriesEntry);

    this._entry_id = entryObject.sys !== undefined ? entryObject.sys.id : '';
    this._bitmovin_url = new ContentfulLibrary.resourceField.plainTextField(this._fields.bitmovin_url);
    this._published_at = new ContentfulLibrary.resourceField.dateField(this._fields.published_at, true);
    this._video = new VideoAsset(this._fields.video_file);
  }

  get entryId() {
    return this._entry_id;
  }

  get publishedAt() {
    return this._published_at;
  }

  get bitmovinURL() {
    return this._bitmovin_url;
  }

  get video() {
    return this._video;
  }
}

/** Helper functions */
function fetchLatestMessage() {
  const now = Cypress.moment(Date.now()).utc().format();
  const list = ContentfulLibrary.query.entryList(`content_type=message&fields.published_at[lte]=${now}&order=-fields.published_at&limit=1`);
  return cy.wrap({ list }).its('list.responseReady').should('be.true').then(() => {
    const firstEntry = list.responseBody.items[0];
    return new ExtendedMessageEntry(firstEntry, {});
  });
}

//Note: last recordable service ends ~7:15 so assume stream must be uploaded sometime after then
function getLatestDate(dayOfWeek = 'Saturday', timeOfDay = '7:15PM') {
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
    fetchLatestMessage().then(latestMessage => {
      contentfulLatestMessage = latestMessage;
      fakeSchedule = new StreamScheduleGenerator().streamStartingNow;
    });
  });

  it('Verify encoding is ready for the latest message in Bitmovin', function () {
    cy.request(`${Cypress.env('CROSSROADS_API_ENDPOINT')}/video-service/encode/latestMessageStatus`).then(response => {
      const latestMessageStatus = response.body;

      //Encodings should be finished
      assert.equal(latestMessageStatus.encodingStatus, 'FINISHED', `Expect the latest message video's encoding status to be 'FINISHED', and status is '${latestMessageStatus.encodingStatus}'.`);
      assert.equal(latestMessageStatus.manifestStatus, 'FINISHED', `Expect the latest message manifest creation status to be 'FINISHED', and status is '${latestMessageStatus.manifestStatus}'.`);

      //Latest message according to Bitmovin should match Contentful
      assert.equal(latestMessageStatus.messageId, contentfulLatestMessage.entryId, `Expect the latest message known to Bitmovin to match the latest message in Contentful. Bitmovin's latest message id is '${latestMessageStatus.messageId}' and Contentful's latest message id is '${contentfulLatestMessage.entryId}'`);
      assert.equal(latestMessageStatus.videoId, contentfulLatestMessage.video.id, `Expect the latest message's video id in Bitmovin to match the video id in Contentful. Bitmovin's video id is '${latestMessageStatus.videoId}' and Contentful's video id is '${contentfulLatestMessage.video.id}'`);
      assert.equal(latestMessageStatus.messageBitmovinUrl, contentfulLatestMessage.bitmovinURL.toString, `Expect the latest message's Bitmovin url to be the same in Bitmovin and Contentful. Bitmovin's latest message url is '${latestMessageStatus.messageBitmovinUrl}' and in Contentful is '${contentfulLatestMessage.bitmovinURL.toString}'`);
    });
  });

  it('Verify the message for this week\'s live stream has been published', function () {
    //Message should be published after the latests Saturday service
    const publishedDate = moment(contentfulLatestMessage.publishedAt.toString);
    const earliestPublishableDate = getLatestDate('Saturday', '7:15PM'); //Roughly when last Saturday service ends
    assert.isTrue(publishedDate.isAfter(earliestPublishableDate), `Expect latest message to be published after ${earliestPublishableDate}. It was published ${publishedDate}`);

    //Message should have Bitmovin URL
    assert.isTrue(contentfulLatestMessage.bitmovinURL.hasValue, `Expect latest message to have a Bitmovin URL, and it is ${contentfulLatestMessage.bitmovinURL.toString}`);
  });

  it('Verify the new message is streamed using the Bitmovin player', function () {
    //Trick /live to think the live stream is playing
    cy.server();
    cy.route('/int/streamSchedule', fakeSchedule);
    cy.route('manifest.m3u8').as('bitmovinManifest');
    const ampEvents = new AmplitudeEventChecker();

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
    ampEvents.waitForVideoEvents(['VideoStarted'], contentfulLatestMessage.bitmovinURL.toString, 3);
  });
});

/** Using the "after" hook or listening for events sometimes doesn't send messages due to bugs in Cypress (issue #2831)
 * This is a hacky but consistent way to get around the issue.
*/
describe('Sends out results', function () {
  it('Sends out Slack and Email alerts', function() {
    cy.reportResultsToSlack();
    cy.reportResultsByEmail();
  });
});