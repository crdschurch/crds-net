/**
 * Gets fake stream schedule response with a broadcast scheduled after given hours
 * @param {int} startTimeOffset In hours and >=0. When a stream should begin relative to now
 */
export const getStreamSchedule = (startTimeOffset) => {
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const now = Cypress.moment(Date.now());

  // Hours must be positive
  startTimeOffset = startTimeOffset < 0 ? 0 : startTimeOffset;

  const stream = {
    'start': now.add(startTimeOffset, 'hours').format(dateFormat),
    'end': now.add(startTimeOffset+1, 'hours').format(dateFormat),
    'title': 'Service Stream - Test Next'
  };

  return {
    'data': {
      'broadcasts': [stream],
      'current': startTimeOffset === 0 ? stream : null,
      'next': stream
    }
  };
};
