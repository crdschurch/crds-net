//TODO make this a function an maybe move to fixtures?
export class StreamScheduleGenerator {
  //Does not support streams starting in the past
  getStreamStartingAfterHours(hours) {
    hours = hours < 0 ? 0 : hours;
    const streamStart = Cypress.moment(Date.now()).add(hours, 'hours');
    const stream = {
      'start': streamStart.format(this._date_format),
      'end': streamStart.add(1, 'hour').format(this._date_format),
      'title': 'Service Stream - Test Next'
    };

    const currentStream = hours == 0 ? stream : null;
    const nextStream = stream;
    const broadcasts = [stream];

    return this._get_schedule(currentStream, nextStream, broadcasts);
  }

  get _date_format(){
    return 'YYYY-MM-DD HH:mm:ss';
  }

  _get_schedule(currentStream, nextStream, broadcastArray) {
    return {
      'data': {
        'broadcasts': broadcastArray,
        'current': currentStream,
        'next': nextStream
      }
    };
  }
}