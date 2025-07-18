/* eslint-disable quotes */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

'use strict';

exports.handler = (event, _ctx, callback) => {
  try {
    const { payload } = JSON.parse(event.body);
    console.log('🎯 BG logger ran — fields:', payload.data); // prove trigger
    return callback(null, { statusCode: 200, body: 'ok' });
  } catch (e) {
    console.error('BG logger error', e);
    return callback(null, { statusCode: 500, body: e.message });
  }
};
