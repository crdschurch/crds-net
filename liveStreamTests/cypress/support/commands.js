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

Cypress.on('fail', (err, runnable) => {
  sendSlackAlert(err.message);
  throw err;
});

export function sendSlackAlert(alertMessage) {
  const slack = require('slack-notify')(Cypress.env('SLACK_WEBHOOK_URL'));
  slack.alert({
    'channel': Cypress.env('slack_channel'),
    'username': 'Live Stream Encoding',
    'attachments': [
      {
        'color': '#FF0000',
        'pretext': 'Warning! The latest message isn\'t ready for the live stream',
        'text': alertMessage
      }
    ]
  });
}

function sendEmailAlert() {
  //TODO send email on failure
}