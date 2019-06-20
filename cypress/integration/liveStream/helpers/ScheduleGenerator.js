export class StreamScheduleGenerator {
  get streamStartingNow() {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const streamStart = Cypress.moment(Date.now());
    const streamEnd = streamStart.add(10, 'minutes');
    const nextStreamStart = streamStart.add(1, 'hour');
    const nextStreamEnd = streamEnd.add(1, 'hour');

    const currentStream = {
      'start': streamStart.format(dateFormat),
      'end': streamEnd.format(dateFormat),
      'title': 'Service Stream - Test Current'
    };

    const nextStream = {
      'start': nextStreamStart.format(dateFormat),
      'end': nextStreamEnd.format(dateFormat),
      'title': 'Service Stream - Test Next'
    };

    const fakeSchedule = {
      'data': {
        'broadcasts': [
          currentStream,
          nextStream
        ],
        'current': currentStream,
        'next': nextStream
      }
    };

    return fakeSchedule;
  }
}