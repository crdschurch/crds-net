'use strict';

module.exports.environmentRedirection = (event, context, callback) => {
  let dest = "https://pushpay.com/g/crossroads";

  try {
    const referer = event.headers.referer
    const conditions = ['localhost', '0.0.0.0', '127.0.0.1', 'int', 'demo', 'development', 'release']
    if(referer && conditions.some(el => referer.includes(el))) {
      dest = "https://sandbox.pushpay.io/g/crossroadscincinnati"
    }
  } catch (err) {}

  return callback(null, {
    statusCode: 307,
    headers: { Location: dest }
  });
};
