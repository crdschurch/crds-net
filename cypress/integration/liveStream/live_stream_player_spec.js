function hideRollCall(){
  localStorage.setItem('crds-roll-call-state', 'dismissed'); //this works
  cy.get('.roll-call').invoke('hide');
}

describe('Tests the /live/stream page displays the expected player', function () {
  it.only('Displays the Bitmovin player when the message has a Bitmovin URL', function () {
    cy.server();
    cy.route('/int/streamSchedule', 'fixture:current_stream_custom.json');//NOTE this fixture just needs some object in the "current" property - dates don't seem to matter


    cy.visit('https://deploy-preview-882--int-crds-net.netlify.com/live/stream');
    hideRollCall();
    //Verify iframe contains the Bitmovin player
    //If we are able to spoof the response with a real message, verify the message autoplays AND fires off the expected analytics events.
  });

  it('Displays a Youtube player when the message does not have a BitmovinURL', function () {
    cy.server();
    cy.route('/broadcaster/crossr30e3/broadcasts/upcomingPlusCurrent', 'fixture:fakeCurrentStream_streamspot.json');
    cy.visit('/live/stream');
    //Verify ifream contains the Bitmovin player
    //Verify as much from the Bitmovin player as applies to Youtube
    //Will there be anything else displayed?
    //How will this work with autoplay? With Analytics?
  });


  //This works https://deploy-preview-882--int-crds-net.netlify.com/live/stream
});