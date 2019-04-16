$(document).ready(function () {
    $('#fullpage').fullpage({
      'verticalCentered': false,
      slidesNavigation: true,
      controlArrows: true,
      slideSelector: '.slide-ash-old',
      navigation: true,
    });

    // $(".opening-scroll-down").click(function () {
    //   $.fn.fullpage.moveTo(2, 0);
    // });

    $(".next-section").click(function () {
      $.fn.fullpage.moveSectionDown();
    });
    //
    $.fn.fullpage.setMouseWheelScrolling(false);
    $.fn.fullpage.setAllowScrolling(false);
    //
    $(".fp-wrapper").fadeTo("slow", 1.0);

  });
