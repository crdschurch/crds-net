$(document).ready(function(event) {
  $('[data-smooth-scroll-to]').click(function(event) {
    event.preventDefault();
    var targetId = $(this).data('smooth-scroll-to');
    var target = document.getElementById(targetId)
    if (target) {
      var scrollTo = $(target).offset().top;
      var offset = parseInt($(this).data('smooth-scroll-offset'));
      if (!isNaN(offset) && offset > 0) { scrollTo -= offset; }
      $('html, body').animate({ scrollTop: scrollTo }, scrollTo / 2);
    }
    return true;
  });
});