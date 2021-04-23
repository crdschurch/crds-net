$(document).ready(function(){
  $("[data-menu-trigger]").mouseup(function () {
    $(this).toggleClass("active");
    $("[data-menu-modal]").toggleClass("open");
    $("#mobile-navbar").toggleClass("open");
  });

  var $myGroup = $("[data-menu-modal]");
  $myGroup.on('show.bs.collapse','.collapse', function() {
    $(this).show();
  });
  $myGroup.on('hide.bs.collapse','.collapse', function() {
    $(this).hide();
  });
});