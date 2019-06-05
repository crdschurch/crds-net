import { MessageQueryManager } from '../../Contentful/QueryManagers/MessageQueryManager';

describe('Tests Bitmovin encoding & manifest exist for latest Contentful message', function () {
  let latestMessage;
  before(function () {
    //get latest published message
    const mqm = new MessageQueryManager();
    mqm.fetchLatestMessage().then((result) => {
      latestMessage = result;
    });
  });

  it('Latest message should have a Bitmovin url', function () {
    assert.isTrue(latestMessage.bitmovinURL.hasValue, 'Latest message must have a bitmovin url');

    const bitmovinPattern = new RegExp('https://\\w+.cloudfront.net/bitmovin/(\\w+)/manifest.m3u8');
    assert.match(latestMessage.bitmovinURL.text, bitmovinPattern, 'Bitmovin URL should have the expected pattern');
  });

  it('Latest message should have a valid Bitmovin encoding and manifest', function () {
    //get name from bitmovin url
    //query bitmovin for encoding and manifest matching name - both must exist

  });

  //TODO - when the message is created is it published Saturday night, or is it left in Draft and waiting for autopublish?
  it.skip('Latest recorded service should be published', function (){
    //Message should be finished recording saturday at x (day and time should be a variable).
    //Normally the processing is finished by y and we're running the verification test at z.
    //Streaming sunday starts at q.

    //Assumptions: message cannot be published before x

    //Always verify the latest message has a valid bitmovin url and manifest (but don't care about published date/time).
    //find the most recent x (or y if we want to be more flexible). Has a message been published since then? Fail if not.
    //consider more precise logic (but riskier if schedule changes)...: find most recent x and most recent z. if z comes before x, verify the latest message was published after x.
    //  if z comes after x
  });
});