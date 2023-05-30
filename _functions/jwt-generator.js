/* eslint-disable quotes */
"use strict";
const JWT = require("jsrsasign");

exports.handler = () => {
  const oHeader = { alg: "HS256", typ: "JWT" };
  const sHeader = JSON.stringify(oHeader);
  var myDate = new Date();
  myDate.setHours(myDate.getHours() + 2160); // 90 days

  const sPayload = JSON.stringify({
    app_metadata: {
      authorization: {
        roles: ["user"],
      },
    },
    exp: Math.floor(myDate.getTime() / 1000),
  });

  const token = JWT.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.JWT_SECRET
  );

  return { statusCode: 200, body: token };
};
