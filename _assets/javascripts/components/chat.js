$(document).ready(function() {
  $('[data-trigger=chat]').click(function(e) {
    console.log('Chat button clicked');
    if (window.Intercom !== undefined && window.Intercom) {
      console.log('Intercom is defined, attempting to show widget.');
      window.Intercom('show');
    } else {
      console.warn('Intercom is undefined');
      window.location.href = '/contactus/';
    }

    e.preventDefault();
  });
});
