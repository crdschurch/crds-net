import { ContentfulLibrary } from 'crds-cypress-tools';
import moment from 'moment';
import 'moment-timezone';

class ExtendedMessageEntry extends ContentfulLibrary.entry.message {
  constructor (entryObject, seriesEntry) {
    super(entryObject, seriesEntry);
    this._bitmovin_url = new ContentfulLibrary.resourceField.plainTextField(this._fields.bitmovin_url);
    this._published_at = new ContentfulLibrary.resourceField.dateField(this._fields.published_at, true);
  }

  get publishedAt() {
    return this._published_at;
  }

  get bitmovinURL() {
    return this._bitmovin_url;
  }
}

function fetchLatestMessage() {
  const now = Cypress.moment(Date.now()).utc().format();
  const list = ContentfulLibrary.query.entryList(`content_type=message&fields.published_at[lte]=${now}&order=-fields.published_at&limit=1`);
  return cy.wrap({ list }).its('list.responseReady').should('be.true').then(() => {
    const firstEntry = list.responseBody.items[0];
    return new ExtendedMessageEntry(firstEntry, {});
  });
}

//Note: last recordable service ends ~7:15 so assume stream must be uploaded sometime after then
function getLatestDate(dayOfWeek = 'Saturday', timeOfDay = '7:15PM'){
  const momentZone = 'America/New_York';
  const now = moment.tz(momentZone);
  let latestTimeOnDay = moment.tz(timeOfDay, 'hh:mmA', momentZone).day(dayOfWeek);
  latestTimeOnDay = latestTimeOnDay.isAfter(now) ? latestTimeOnDay.subtract(7, 'days') : latestTimeOnDay;
  return latestTimeOnDay;
}

describe('Tests latest message is current and ready for live stream', function () {
  it('Verify encoding is ready for the latest message in Bitmovin', function () {
    //hit endpoint
    //if response is valid continue, if invalid, send alerts and fail test.
  });

  it.only('Verify the message for this week\'s live stream has been published', function () {
    fetchLatestMessage().then((latestMessage) => {
      //Message should be published after the latests Saturday service
      const publishedDate = moment(latestMessage.publishedAt.toString);
      const earliestPublishableDate = getLatestDate('Saturday', '7:15PM'); //Roughly when last Saturday service ends
      assert.isTrue(publishedDate.isAfter(earliestPublishableDate), `Expect latest message to be published after ${earliestPublishableDate}, and it was published ${publishedDate}`);

      //Message should have Bitmovin URL
      assert.isTrue(latestMessage.bitmovinURL.hasValue, `Expect latest message to have a Bitmovin URL, and it is ${latestMessage.bitmovinURL.toString}`);

      //Message and video id should match latest message in Bitmovin
      //TODO need endpoint from Jason
    });
  });

  it('Verify the new message is streamed using the Bitmovin player', function () {
    //stub the scheduler so streaming appears to be 'on'
    //verify the player is displayed and is bitmovin
    //Verify is autoplayed
  });
});