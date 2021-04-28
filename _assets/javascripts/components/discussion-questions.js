$(document).ready(function() {
  $('#collapse-discussion-questions').on('show.bs.collapse', function(e) {
    var id = $(e.target).attr('id');
    var el = $("[href='#" + id + "']");
    var toggle = el.find('.text');
    var text = toggle.text().trim();

    if (el.data('toggle-default') === undefined) {
      el.attr('data-toggle-default', text);
    }
    toggle.text(el.data('toggle-text'));
  });

  $('#collapse-discussion-questions').on('hide.bs.collapse', function(e) {
    var id = $(e.target).attr('id');
    var el = $("[href='#" + id + "']");
    var toggle = el.find('.text');
    toggle.text(el.data('toggle-default'));
  });
});
