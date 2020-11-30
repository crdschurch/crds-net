$(document).ready(function() {
  new Imgix.Optimizer();

  var n = setInterval(function(){
    var imgs = $('[data-imgix-img-processed]'),
        bgs = $('[data-imgix-bg-processed]');

    if(imgs.length == 0 && bgs.length == 0) {
      $(window).trigger('resize');
    } else {
      clearInterval(n);
    }
  }.bind(this), 250);

  setTimeout(function(){
    clearInterval(n);
  }.bind(this), 3000);
});