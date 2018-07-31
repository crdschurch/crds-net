window.CRDS = window.CRDS || {};

// ---------------------------------------- | Images

CRDS.Images = function(img) {};
CRDS.Images.prototype.constructor = CRDS.Images;
CRDS.Images.prototype.init = function(parent='body') {
  $(parent + ' img[data-optimize-img]').each(function(idx, img) {
    new CRDS.ImageOptimizer(img);
  });
  $(parent + ' [data-optimize-bg-img]').each(function(idx, bgEl) {
    new CRDS.BgImageOptimizer(bgEl);
  });
};

// ---------------------------------------- | ImageOptimizer

CRDS.ImageOptimizer = function(img) {
  // Length of crossfade transition.
  this.timeToFade = 250;

  // Main (pixellated placeholder) image.
  this.img = $(img);

  // Temp duplicate for loading the full-size image.
  this.tmpImg = this.img.clone();

  // Load an image in memory matching the source, then kick-off the processing.
  $('<img>').on('load', $.proxy(this.renderTmpImg, this)).attr('src', this.img.attr('src'));
};

CRDS.ImageOptimizer.prototype.constructor = CRDS.ImageOptimizer;

CRDS.ImageOptimizer.prototype.renderTmpImg = function() {
  // Set the CSS of the temp element to sit right behind the pixellated image.
  this.tmpImg.css({
    position: 'absolute',
    top: this.img.position().top,
    left: this.img.position().left,
    width: this.img.width(),
    height: this.img.height(),
    zIndex: '-1'
  });

  // Prep temp image for imgix. We have to replace the placeholder URL with the
  // proper dimensions for the space for browsers that don't support
  // srcset/sizes.
  var newSrc = this.img.attr('src')
    .replace(/(\?|\&)(w=)(\d+)/i, '$1$2' + this.img.width())
    .replace(/(\?|\&)(h=)(\d+)/i, '$1$2' + this.img.height());
  this.tmpImg.attr('ix-src', newSrc);
  this.tmpImg.addClass('img-responsive tmp-img-placeholder');
  this.tmpImg.removeAttr('data-optimize-img');

  // Add temp image to the DOM.
  this.tmpImg.insertBefore(this.img);

  // Once the image is loaded, start the transition. This is the critical piece.
  // imgix.js uses the ix-src attribute to build out the srcset attribute. Then,
  // based on the sizes attribute, the browser determines which source to
  // render. Therefore we can't preload in memory because we need imgix to do
  // its thing directly in the DOM.
  this.tmpImg.on('load', $.proxy(this.transitionImg, this));
  imgix.init();
}

CRDS.ImageOptimizer.prototype.transitionImg = function() {
  if (!this.img) { return }
  // Fade placeholder image out.
  this.img.fadeTo(this.timeToFade, 0);

  // Wait to fully transition until the fade is complete, then remove the temp
  // image's custom styles and remove the original image from the DOM.
  setTimeout($.proxy(function() {
    this.tmpImg.removeAttr('style');
    this.tmpImg.removeClass('tmp-img-placeholder');
    this.tmpImg.attr('data-img-processed', true);
    if(this.img !== undefined) {
      this.img.remove();
      this.img = undefined;
    }
  }, this), this.timeToFade);
}

// ---------------------------------------- | BgImageOptimizer

CRDS.BgImageOptimizer = function(bgEl) {
  // Timing of fade-in transition.
  this.timeToFade = 1000;

  // The primary element(i.e. the one with the background image).
  this.bgEl = $(bgEl);

  // URL of the placeholder background image.
  this.imgUrl = this.bgEl.css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "");

  // Start building the full-size image when after the placeholder has been
  // loaded.
  $('<img>').on('load', $.proxy(this.renderTmpImg, this)).attr('src', this.imgUrl);
};

CRDS.BgImageOptimizer.prototype.constructor = CRDS.BgImageOptimizer;

CRDS.BgImageOptimizer.prototype.renderTmpImg = function() {
  this.bgEl.parent().css('position', 'relative');

  // First, create a clone of the element with the background image and remove
  // its content. Then place it behind the primary element.
  this.tmpPlacholderBgEl = this.bgEl.clone();
  this.tmpPlacholderBgEl.html('');
  this.tmpPlacholderBgEl.css({
    position: 'absolute',
    top: this.bgEl.position().top,
    left: this.bgEl.position().left,
    width: this.bgEl.outerWidth(),
    height: this.bgEl.outerHeight(),
    zIndex: '-1'
  });
  this.tmpPlacholderBgEl.addClass('tmp-bg-img-placeholder');
  this.tmpPlacholderBgEl.insertBefore(this.bgEl);

  // Remove the background image from the main primary element. The user won't
  // notice this transition because the temp duplicate image is already set and
  // is sitting behind the primary element.
  this.bgEl.css('background-image', null);

  // Clone the temp container, then set a background image for it that spans the
  // dimensions of the primary element. And place it behind the pixellated
  // temporary placeholder.
  this.tmpFullSizeBgEl = this.tmpPlacholderBgEl.clone();
  var newUrl = this.imgUrl
    .replace(/(\?|\&)(w=)(\d+)/i, '$1$2' + this.bgEl.width())
    .replace(/(\?|\&)(h=)(\d+)/i, '$1$2' + this.bgEl.height());
  this.tmpFullSizeBgEl.css({
    backgroundImage: 'url("' + newUrl + '")',
    zIndex: '-2'
  });
  this.tmpFullSizeBgEl.addClass('tmp-bg-img-placeholder');
  this.tmpFullSizeBgEl.insertBefore(this.tmpPlacholderBgEl);

  // Load the full-size image in memory, and when its loaded kick off the
  // transition.
  $('<img>').on('load', $.proxy(this.transitionImg, this)).attr('src', newUrl);
}

CRDS.BgImageOptimizer.prototype.transitionImg = function() {
  // Fade out the pixellated clone of the primary element.
  this.tmpPlacholderBgEl.fadeTo(this.timeToFade, 0);

  // After fade out, set the background image on the primary element as the
  // full-size image. Once it's set, remove the full-size placeholder.
  setTimeout($.proxy(function() {
    this.bgEl.css('background-image', this.tmpFullSizeBgEl.css('background-image'));
    this.bgEl.attr('data-bg-img-processed', true);
    this.tmpPlacholderBgEl.remove();
    this.tmpFullSizeBgEl.remove();
    this.tmpPlacholderBgEl = undefined;
    this.tmpFullSizeBgEl = undefined;
  }, this), this.timeToFade);
}

// ---------------------------------------- | Initializer

$(document).ready(function() {
  if(typeof window.CRDS['_instances'] === "undefined") {
    window.CRDS['_instances'] = {}
  }
  imgs = new CRDS.Images();
  imgs.init();
  window.CRDS['_instances']['Images'] = imgs;
});

// ---------------------------------------- | Window Resize Adjustments

// After the window is resized, look for any background images and update their
// source to reflect the new size.
$(window).on('resizeEnd', function(event) {
  $('[data-optimize-bg-img]').each(function(idx, bgEl) {
    if ($(this).data('bg-img-processed')) {
      var newUrl = $(this)
        .css('background-image')
        .replace('url(', '')
        .replace(')', '')
        .replace(/\"/gi, "")
        .replace(/(\?|\&)(w=)(\d+)/i, '$1$2' + $(this).outerWidth())
        .replace(/(\?|\&)(h=)(\d+)/i, '$1$2' + $(this).outerHeight());
      $(this).css('background-image', "url('" + newUrl + "')")
    }
  });
});

// Trigger "resizeEnd" event on the window object after resizing has ceased for
// at least 0.5 seconds.
$(window).resize(function() {
  if (this.resizeTo) clearTimeout(this.resizeTo);
  this.resizeTo = setTimeout(function() {
    $(this).trigger('resizeEnd');
  }, 500);
});
