function parseCommand(originalCommand) {
  var commandArray = originalCommand.split('.');
  return commandArray[commandArray.length - 1];
}

function abstractedAnalytics(originalCommand, event, eventCategory, eventAction) {
  var command = this.parseCommand(originalCommand);
  switch(command) {
    case 'create':
      break;
    case 'send':
      gtag('event', eventAction, { 'event_category': eventCategory });
      break;
    case 'set':
      var data = {};
      data[event] = eventCategory;
      gtag('set', data);
      break;
    default:
      this.error('gtag() command not found! Command: ' + command);
  }
}
