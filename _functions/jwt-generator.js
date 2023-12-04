/* eslint-disable quotes */
"use strict";
const JWT = require("jsrsasign");

exports.handler = (event, _context, callback) => {
  if (event.httpMethod !== "POST") {
    return callback(null, {
      statusCode: 405,
      body: JSON.stringify({ msg: "Method Not Allowed" }),
    });
  }

  const oHeader = { alg: "HS256", typ: "JWT" };
  const sHeader = JSON.stringify(oHeader);
  var expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2160); // 90 days

  const sPayload = JSON.stringify({
    app_metadata: {
      authorization: {
        roles: ["user"],
      },
    },
    exp: Math.floor(expiresAt.getTime() / 1000),
  });

  const token = JWT.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.JWT_SECRET
  );

  const body = JSON.stringify({ token, expiresAt });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST",
  };

  return callback(null, {
    statusCode: 200,
    body,
    headers,
  });
};