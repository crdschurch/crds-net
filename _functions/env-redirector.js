'use strict';

exports.handler = (event, context, callback) => {
  let dest = "https://pushpay.com/g/crossroads";

  try {
    const referer = event.headers.referer
    if(referer) {

      // if referer resembles INT or local address...
      if(['development', 'localhost', '0.0.0.0', '127.0.0.1', 'int' ].some(el => referer.includes(el))) {
        dest = "https://sandbox.pushpay.io/g/crossroadscincinnatiint"

      // if referer resembles DEMO address...
      } else if (['demo', 'release'].some(el => referer.includes(el))) {
        dest = "https://sandbox.pushpay.io/g/crossroadscincinnatilegacy"

      }
    }
  } catch (err) {}

  return callback(null, {
    statusCode: 307,
    headers: { Location: dest }
  });
};
