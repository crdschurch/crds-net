// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

//TODO once email working - figure out how to collect all errors and send at once. Do this for slack too.
const errors = [];

Cypress.on('fail', (err, runnable) => {
  // sendSlackAlert(err.message);
  // addErrorMessageToEmail(err.message);
  sendEmailAlert(err.message).catch(err => {
    console.error(err.message);
    // process.exit(1);
  });
  throw err;
});

// Cypress.Commands.add("sendEmailWithErrors", () => {
//   console.log(`num errors captured ${errors.length}`);//DEBUG
//   if(errors.length > 0){
//     console.log('there are no errors');//DEBUG
//     return;
//   }

//   const sendmail = require('sendmail')();
//   const body = `Our tests found these issues with the latest message:\n${errors.join('\n')}`;

//   sendmail({
//     from: 'shenney101@gmail.com',
//     to: 'shenney@callibrity.com, ontheboulevard2212@yahoo.com',
//     subject: 'Warning! The latest message isn\'t ready for the live stream',
//     html: body,
//   }, function(err, reply) {
//     console.log(err && err.stack);
//     console.dir(reply);
//   });
// });

function sendSlackAlert(alertMessage) {
  const slack = require('slack-notify')(Cypress.env('SLACK_WEBHOOK_URL'));
  const body = {
    'username': 'Live Stream Encoding',
    'attachments': [
      {
        'color': '#FF0000',
        'pretext': 'Warning! The latest message isn\'t ready for the live stream',
        'text': alertMessage
      }
    ]
  };

  let channels = Cypress.env('slack_channel').split(',');
  channels.forEach(channel => {
    body.channel = channel;
    slack.alert(body);
  });
}

function addErrorMessageToEmail(alertMessage) {
  errors.push(alertMessage);
}

// function sendEmailAlertSML(alertMessage) {
//   console.log('sending email!');
//   const sendmail = require('sendmail')();
//   const body = `Our tests found these issues with the latest message:\n${alertMessage}`;

//   sendmail({
//     from: 'shenney101@gmail.com',
//     to: 'shenney@callibrity.com, ontheboulevard2212@yahoo.com',
//     replyTo: 'shenney101@gmail.com',
//     subject: 'Warning! The latest message isn\'t ready for the live stream',
//     html: body,
//   }, function (err, reply) {
//     console.log(`error sending email! ${err}`);
//     console.log(err && err.stack);
//     console.dir(reply);
//   });
// }

//TODO this doesn't work - need more info on smtp config?
async function sendEmailAlert(alertMessage) {
  console.log('sending email!');
  const nodemailer = require('nodemailer');
  const body = `Our tests found these issues with the latest message:\n${alertMessage}`;

  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'windows',
    logger: false
  });

  let message = {
    from: 'Sarah <shenney101@gmail.com>',
    to: 'Sarah H <shenney@callibrity.com',
    subject: 'Test message',
    text: body
  };

  let info = await transporter.sendMail(message);
  console.log('Message sent successfully as %s', info.messageId);
}