$(document).ready(function() {
  $('[data-trigger=chat]').click(function(e) {
    console.log('Chat button clicked');
    if (window.Intercom !== undefined || $('.intercom-launcher').length > 0) {
      console.log('Intercom is defined, attempting to show widget.');
      window.Intercom('show');
    } else {
      console.log('Intercom is undefined, initializing mailto.');
      window.location.href = 'mailto:hello@crossroads.net';
    }

    e.preventDefault();
  });
});
