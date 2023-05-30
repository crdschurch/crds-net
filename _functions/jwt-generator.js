/* eslint-disable quotes */
"use strict";
const JWT = require("jsrsasign");

exports.handler = (_event, _context, callback) => {
  const oHeader = { alg: "HS256", typ: "JWT" };
  const sHeader = JSON.stringify(oHeader);
  var expiration = new Date();
  expiration.setHours(expiration.getHours() + 2160); // 90 days

  const sPayload = JSON.stringify({
    app_metadata: {
      authorization: {
        roles: ["user"],
      },
    },
    exp: Math.floor(expiration.getTime() / 1000),
  });

  const body = JWT.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.JWT_SECRET
  );

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  return callback(null, {
    statusCode: 200,
    body,
    headers,
  });
};
