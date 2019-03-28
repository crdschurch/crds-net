$(document).ready(function () {
    $('#fullpage').fullpage({
      'verticalCentered': false,
      slidesNavigation: true,
      controlArrows: false,
      afterLoad: function (anchorLink, index) {
        //console.log("afterLoad--" + "anchorLink: " + anchorLink + " index: " + index );
        if (index == 2) {
          $(".ash-audio").show();
          //$(".ash-audio-controls").trigger( "click" );
          $.fn.fullpage.setMouseWheelScrolling(true);
          $.fn.fullpage.setAllowScrolling(true);
        }
      },
      afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
        //console.log("afterSlideLoad--" + "anchorLink: " + anchorLink + " index: " + index + " slideAnchor: " + slideAnchor + " slideIndex: " + slideIndex);
        if (slideIndex == 7) {
          $(".fp-controlArrow.fp-next").hide();
        } else {
          $(".fp-controlArrow.fp-next").show();
        }
      },
    });

    $(".opening-scroll-down").click(function () {
      $.fn.fullpage.moveTo(2, 0);
    });

    $(".move-right").click(function () {
      $.fn.fullpage.moveSlideRight();
    });

    $.fn.fullpage.setMouseWheelScrolling(false);
    $.fn.fullpage.setAllowScrolling(false);

    $(".fp-wrapper").fadeTo("slow", 1.0);

  });
