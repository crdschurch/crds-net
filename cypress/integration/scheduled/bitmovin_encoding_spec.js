import { MessageQueryManager } from '../../Contentful/QueryManagers/MessageQueryManager';
import Bitmovin from 'bitmovin-javascript';
//TODO remove this when transferred
describe.skip('Tests Bitmovin encoding & manifest exist for latest Contentful message', function () {
  let latestMessage;
  before(function () {
    // get latest published message
    const mqm = new MessageQueryManager();
    mqm.fetchLatestMessage().then((result) => {
      latestMessage = result;
    });
  });

  //This will be tested using hte endpoint
  it.skip('Latest message should have a Bitmovin url', function () {
    assert.isTrue(latestMessage.bitmovinURL.hasValue, 'Latest message must have a bitmovin url');

    const bitmovinPattern = new RegExp('https://\\w+.cloudfront.net/bitmovin/(\\w+)/manifest.m3u8');
    assert.match(latestMessage.bitmovinURL.text, bitmovinPattern, 'Bitmovin URL should have the expected pattern');
  });

  it.skip('Latest message should have a valid Bitmovin encoding and manifest', function () {
    //get name from bitmovin url
    //query bitmovin for encoding and manifest matching name - both must exist

    getAllEncodings().then(encodings => {
      cy.log(JSON.stringify(encodings));
    });

    getAllHLSManifests().then(manifests => {
      cy.log(JSON.stringify(manifests));
    });
    // const bitmovin = Bitmovin({ 'apiKey': Cypress.env('BITMOVIN_API_KEY') });
    // const limit = 100;
    // const offset = 0;
    // bitmovin.encoding.encodings.list(limit, offset).then(result => {
    //   cy.log(JSON.stringify(result));
    //   // const { items } = result;
    //   // items.forEach(input => {
    //   //   cy.log(input.name);
    //   // });
    // });
  });

  // function bmvn() {
  //   return new Promise(function (resolve, reject) {
  //     const encodings = await getAllEncodings();
  //   })
  // }


  function getAllEncodings(encodings, offset) {
    const bitmovin = Bitmovin({ 'apiKey': Cypress.env('BITMOVIN_API_KEY') });
    if (encodings === void 0) { encodings = []; }
    if (offset === void 0) { offset = 0; }
    return bitmovin.encoding.encodings.list(100, offset)
      .then(function (result) {
        cy.log(`All encoding results ${JSON.stringify(result)}`);//DEBUG
        var items = result.items;
        encodings = encodings.concat(items);
        if (items.length !== 2)
          return encodings;
        return getAllEncodings(encodings, offset + 100);
      });
  }

  function getAllHLSManifests(manifests, offset) {
    const bitmovin = Bitmovin({ 'apiKey': Cypress.env('BITMOVIN_API_KEY') });
    if (manifests === void 0) { manifests = []; }
    if (offset === void 0) { offset = 0; }
    return bitmovin.encoding.manifests.hls.list(100, offset)
      .then(function (result) {
        cy.log(`All manifest results ${JSON.stringify(result)}`);//DEBUG
        var items = result.items;
        manifests = manifests.concat(items);
        if (items.length !== 2)
          return manifests;
        return getAllHLSManifests(manifests, offset + 100);
      });
  }

  //TODO - when the message is created is it published Saturday night, or is it left in Draft and waiting for autopublish?
  it.skip('Latest recorded service should be published', function () {
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


describe('does the thing but tests with the endbpoint', function(){
  it('Verify encoding is ready for the latest message in Bitmovin', function (){
    //hit endpoint
    //if response is valid continue, if invalid, send alerts and fail test.
  });

  it.only('Verify the message for this week\'s live stream has been published', function () {
    let latestContentfulMessage;
    const mqm = new MessageQueryManager();
    mqm.fetchLatestMessage().then((result) => {
      latestContentfulMessage = result;
      cy.log(latestContentfulMessage.publishedAt.date);
    });


    //is message published, verify time
    //does message have bitmovin url


    //high level
    //verify published time of latest message from contentful is within time range (not last week's message)
    //verify the messag id matches what we expect the message id to be.
  });

  it('Verify the new message is streamed using the Bitmovin player', function () {
    //stub the scheduler so streaming appears to be 'on'
    //verify the player is displayed and is bitmovin
    //Verify is autoplayed
  })
})