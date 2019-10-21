const querystring = require('querystring');

export const amplitude = {
  isVideoStarted: (request) => {
    let parsedBody = JSON.parse(querystring.decode(request.body).e)[0];
    return parsedBody.event_type === 'VideoStarted';
  }
};