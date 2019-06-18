const querystring = require('querystring');

export class AmplitudeEventChecker {
  constructor () {
    this._wait_timeout = 6000;
    cy.server();
    this.defineRoute();
  }

  defineRoute() {
    this._route_alias = 'amplitudeEvents';
    cy.route({
      method: 'POST',
      url: 'api.amplitude.com'
    }).as(this._route_alias);
  }

  set waitTimeout(timeout) {
    this._wait_timeout = timeout;
  }

  /**
   * Verifies all the events in the list of Amplitude event types are sent for the given video within the first maxEventsToWaitOn and timeout
   * @param {Object[]} eventTypeList - A list of event types (found in the request's form data assigned to "event_type")
   * @param {String} videoId - The video id expected in the event
   * @param {Number} maxEventsToWaitOn - >= 1. Will wait for at least one event.
   */
  waitForVideoEvents(eventTypeList, videoId, maxEventsToWaitOn = 1) {
    const eventTracker = {
      event_types: eventTypeList,
      video_id: videoId,
      seen_event_types: []
    };

    const maxRecursionDepth = maxEventsToWaitOn < eventTypeList.length ? eventTypeList.length : maxEventsToWaitOn;

    this._recursiveWaitForVideoEvents(eventTracker, maxRecursionDepth).then(() => {
      cy.wrap(eventTracker).its('seen_event_types').should('include.members', eventTracker.event_types);
    });
  }

  /**
   * Waits for a certain number of Amplitude events and asserts none contain the given event type for the video.
   * @param {Object[]} eventTypeList - A list of event types (found in the request's form data assigned to "event_type")
   * @param {String} videoId - The video id expected in the event
   * @param {Number} maxEventsToWaitOn - >= 1. Will wait for at least one event.
   */
  failOnVideoEvent(eventTypeList, videoId, maxEventsToWaitOn = 1) {
    const eventTracker = {
      event_types: eventTypeList,
      video_id: videoId
    };

    const maxRecursionDepth = maxEventsToWaitOn < eventTypeList.length ? eventTypeList.length : maxEventsToWaitOn;
    this._recursiveFailOnVideoEvent(eventTracker, maxRecursionDepth);
  }

  /**
   * Waits for an Amplitude event and checks if it matches an event type for the video. If there are more event types to wait on, a new wait event will be created.
   * @param {Object} eventTracker - Object with event_types: [...], seen_event_types: [], and videoId;
   * @param {Number} maxEventsToWaitOn - >= 1. Will wait for at least one event.
   */
  _recursiveWaitForVideoEvents(eventTracker, maxEventsToWaitOn) {
    expect(maxEventsToWaitOn).to.be.a('Number');

    return cy.wait(`@${this._route_alias}`, { timeout: this._wait_timeout }).then((results) => {
      const smt = JSON.parse(querystring.decode(results.request.body).e)[0];
      const type = `${smt.event_type}`;
      const videoId = `${smt.event_properties.VideoId}`;

      const index = eventTracker.event_types.findIndex((expectedType) => {
        return expectedType === type && eventTracker.video_id === videoId;
      });

      if (index > -1) {
        assert.equal(type, eventTracker.event_types[index], `${eventTracker.event_types[index]} event should be triggered`);
        assert.equal(videoId, eventTracker.video_id, `Event should be triggered for video ${eventTracker.video_id}`);
        eventTracker.seen_event_types.push(eventTracker.event_types[index]);
      }

      if (eventTracker.seen_event_types.length < eventTracker.event_types.length &&
        maxEventsToWaitOn >= 1)
        return this._recursiveWaitForVideoEvents(eventTracker, maxEventsToWaitOn - 1);
    });
  }

  /**
   * Waits for a certain number of Amplitude events and asserts none contain the given event type for the video.
   * @param {Object} eventTracker - Object with the event_types: [...] and videoId we expect to not be triggered. If seen, test will fail.
   * @param {Number} maxEventsToWaitOn - >= 1. Will wait for at least one event.
   */
  _recursiveFailOnVideoEvent(eventTracker, maxEventsToWaitOn) {
    expect(maxEventsToWaitOn).to.be.a('Number');

    //cy.wait() will time out if the event is not seen, so do not fail if that error is thrown.
    cy.on('fail', (err) => {
      const matchTimeoutError = new RegExp('Timed out retrying: cy.wait\\W+timed out waiting \\d+ms for the \\d+\\w{2} request to the route: \'amplitudeEvents\'. No request ever occurred.');
      if (matchTimeoutError.test(err.message)) {
        return false;
      }
      throw err;
    });

    return cy.wait(`@${this._route_alias}`, { timeout: this._wait_timeout }).then((results) => {
      const smt = JSON.parse(querystring.decode(results.request.body).e)[0];
      const type = `${smt.event_type}`;
      const videoId = `${smt.event_properties.VideoId}`;

      eventTracker.event_types.forEach((unwantedTypes) => {
        assert.isFalse(unwantedTypes === type && eventTracker.video_id === videoId, `${unwantedTypes} event for video ${eventTracker.video_id} should not be triggered`);
      });

      if (maxEventsToWaitOn >= 1)
        return this._recursiveFailOnVideoEvent(eventTracker, maxEventsToWaitOn - 1);
    });
  }
}
