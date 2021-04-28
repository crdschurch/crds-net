$(document).ready(function(){

  var successContainer = $('<div id="clipboard-success"></div>');
  successContainer.prependTo('body');

  $('.clipboard').each(function(idx, btn) {
    var clipboard = new ClipboardJS(this);

    clipboard.on('success', function(e) {
      var success = $('<div class="alert alert-success"></div>');
      success.text($(e.trigger).data('clipboard-success'));
      success.appendTo(successContainer);
      setTimeout(function(){
        success.remove();
      }, 3000);
    });

    clipboard.on('error', function(e) {
      console.log(e);
    });
  });
});
