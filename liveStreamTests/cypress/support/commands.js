const errors = [];

Cypress.on('fail', (err) => {
  errors.push(err.message);
  throw err;
});

Cypress.Commands.add('reportResultsToSlack', () => {
  reportResultsToSlack();
});

Cypress.Commands.add('reportResultsByEmail', () => {
  reportResultsByEmail();
});

function reportResultsToSlack() {
  const slack = require('slack-notify')(Cypress.env('SLACK_WEBHOOK_URL'));

  //Construct Slack message
  const body = {
    'username': 'Live Stream Encoding'
  };
  _addSlackTextAndAttachments(body);

  //Post message to Slack
  let postType = errors.length > 0 ? slack.alert : slack.success;
  let channels = Cypress.env('slack_channel').split(',');
  channels.forEach(channel => {
    body.channel = channel;
    postType(body);
  });
}

function _addSlackTextAndAttachments(body) {
  if (errors.length > 0) {
    body['text'] = 'Warning! The latest message isn\'t ready for the live stream';
    body['attachments'] = errors.map(m => {
      return {
        'color': '#FF0000',
        'text': m
      };
    });
  } else {
    body['text'] = 'Hooray! The latest message is ready for the live stream';
  }
}

function reportResultsByEmail() {
  //Only send email if something went wrong
  if (errors.length == 0)
    return;

  let emailBody = {
    api_user: Cypress.env('SENDGRID_USER'),
    api_key: Cypress.env('SENDGRID_PW'),
    from: 'no-reply@crossroads.net',
    to: Cypress.env('email_recipients').split(',')
  };
  _addEmailSubjectAndBody(emailBody);

  //Send message
  cy.request({
    method: 'POST',
    url: 'https://api.sendgrid.com/api/mail.send.json',
    form: true,
    body: emailBody
  });
}

function _addEmailSubjectAndBody(body) {
  if (errors.length > 0) {
    body['subject'] = "Warning! The latest message isn't ready for the live stream";
    body['html'] = `Something went wrong preparing the latest message for the live stream:<ul>${errors.map(e => `<li>${e}</li>`)}</ul>`;
  } else {
    body['subject'] = 'The lates message is ready for the live stream';
    body['text'] = 'Hooray!';
  }
}
