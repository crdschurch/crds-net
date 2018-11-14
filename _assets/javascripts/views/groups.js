document.addEventListener("deferred-js-ready", function() {
  groupsInit();
});

// if app-deferred loads first
if (window.deferredJSReady) {
  groupsInit();
}

function groupsInit() {
  function domasonry() {
    var $grid = $('.grid').isotope({
      layoutMode: 'fitRows',
      itemSelector: '.grid-item',
      percentPosition: true,
      filtersGroupSelector: '.filters',
      masonry: {
        columnWidth: '.grid-sizer'
      }
    });

    $('.group-content-preloader').hide();
    $('.group-content-grid').css('visibility', 'visible');


    // filter functions
    var filterFns = {
      // show if number is greater than 60
      numberGreaterThan60: function () {
        var number = $(this).find('.number').text();
        return parseInt(number, 10) > 60;
      },
      // show if name ends with -ium
      ium: function () {
        var name = $(this).find('.name').text();
        return name.match(/ium$/);
      }
    };
    // bind filter button click
    $('.filters-button-group').on('click', 'button', function () {
      var filterValue = $(this).attr('data-filter');
      // use filterFn if matches value
      filterValue = filterFns[filterValue] || filterValue;
      $grid.isotope({
        filter: filterValue
      });
    });
    // change is-checked class on buttons
    $('.button-group').each(function (i, buttonGroup) {
      var $buttonGroup = $(buttonGroup);
      $buttonGroup.on('click', 'button', function () {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
      });
    });
  }
  domasonry();
  $('.button-group').hide();
}
