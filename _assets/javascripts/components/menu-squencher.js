(function(){

  // The padding on the sides of the item is 5px on tablet and 8px on desktop.
  // However, simply looking at the outer width was still causing overflow
  // problems. Adding an even 20px (accounting for the 16px padding plus 4px
  // extra) seems to work well.
  var itemPadding = 28;

  /**
   * @function initSquenchable()
   * Preps the menu for squenching and provides the initial squench.
   *
   * @returns {undefined}
   */
  var initSquenchable = function() {
    // Add data-width attribute to each item to store its width. This is done
    // because when an item is hidden (display: none) its width calculates to 0,
    // which breaks the system.
    squenchableItems().each(function(idx, item) {
      $(item).attr('data-width', Math.ceil($(item).width()) + itemPadding);
    });
    // Make the same calculation for the overflow ("More >") item.
    overflowContainer().attr('data-width', Math.ceil(overflowContainer().width()) + itemPadding);
    // Run the squencher.
    run();
    // Items (and overflow container) are invisible (invisible items still take
    // up space, while hidden items do not) by default. Once the initial
    // calculation has run, it's safe to show the items. This prevents a flash
    // of the menu overflowing into multiple rows.
    squenchableItems().removeClass('invisible');
    overflowContainer().removeClass('invisible');
    return;
  }

  /**
   * @function run()
   * Processes the squenching.
   *
   * @returns {undefined}
   */
  var run = function() {
    // Hide the overflow menu while the squencher is running. (It will only
    // reappear if necessary.)
    overflowContainer().addClass('hidden');
    // Remove all items within the overflow dropdown menu.
    overflowDropzone().html('');
    // Calculate the initial available width as the width of the area for the
    // menu minus the area necessary for the overflow container.
    var availableWidth = squenchableWidth() - overflowWidth();
    // Cycle through the items and perform the appropriate action.
    squenchableItems().each(function(idx, item) {
      // If the current item will fit in the remaining available space ...
      if (availableWidth > $(item).data('width')) {
        // Subtract the item's width from the available width.
        availableWidth -= $(item).data('width');
        // Make sure the item is visible.
        $(item).removeClass('hidden');
      }
      // If the current item won't fit ...
      else {
        // Ensure no other items will fit.
        availableWidth = 0;
        // Make overflow container visible.
        overflowContainer().removeClass('hidden');
        // Create a clone of the current item and add it to the bottom of the
        // overflow dropdown menu.
        var clone = $(item).clone().appendTo(overflowDropzone());
        // Show the item within the dropdown menu.
        clone.removeClass('hidden');
        // Hide the current item from the main menu.
        $(item).addClass('hidden');
      }
    });
  }

  /**
   * @function squenchableItems()
   * An jQuery array of squenchable item objects.
   *
   * @returns {(jQuery) array}
   */
  var squenchableItems = function() {
    return $('[data-squenchable-item]');
  }

  /**
   * @function squenchableWidth()
   * Width of the space available to the visible menu.
   *
   * @returns {number}
   */
  var squenchableWidth = function() {
    return Math.floor($('[data-squenchable-container]').width());
  }

  /**
   * @function overflowContainer()
   * Container for the overflow items. (i.e. the "More >" dropdown trigger)
   *
   * @returns {jQuery object}
   */
  var overflowContainer = function() {
    return $('[data-squenchable-overflow]').first();
  }

  /**
   * @function overflowWidth()
   * Width of the space needed for the overflow container. (This gets calculated
   * in the initSquenchable() function, so all this is doing is referencing the
   * element's data-width attribute.)
   *
   * @returns {number}
   */
  var overflowWidth = function() {
    return overflowContainer().data('width');
  }

  /**
   * @function overflowDropzone()
   * The overflow dropdown menu.
   *
   * @returns {jQuery object}
   */
  var overflowDropzone = function() {
    return $(overflowContainer().data('squenchable-overflow')).first();
  }

  // Run initSquenchable() when the DOM is ready.
  $(document).ready(initSquenchable);

  // Run the squencher whenever the window is resized.
  $(window).on('resize', run);
})();
