export default class BackgroundImage {
  constructor(el) {
    // Length of time to complete fade-in transition.
    this.timeToFade = 500;
    // Data attribute applied before processing.
    this.processingAttr = 'data-imgix-bg-processed';
    // Device pixel ratio assumes 1 if not set.
    this.dpr = window['devicePixelRatio'] || 1;
    // The largest image that has been loaded. This assumes the height of the
    // container will not change.
    this.largestImageWidth = 0;
    // The primary element (i.e. the one with the background image).
    this.el = $(el);
    // Background image CSS property must be present.
    if (this.el.css('background-image') == 'none') {
      return;
    }
    // Prepare the element and its container for optimization.
    this.initEl();
    // Kick off the optimization process.
    this.initOptimization();
    // Listen for window resize events.
    this.initEventListeners();
  }

  /**
   * Load an image in memory (not within the DOM) with the same source as the
   * placeholder image. Once that has completed, we know we're safe to begin
   * processing.
   */
  initOptimization() {
    $('<img>')
      .on('load', $.proxy(this.listenForIntersection, this))
      .attr('src', this.placeholderImgUrl);
  }

  /**
   * When the element intersects the viewport, begin processing.
   * (IntersectionObserver and Object.assign() are not supported by IE, but the
   * polyfills are loaded by Imgix.Optimizer.)
   */
  listenForIntersection() {
    const observer = new IntersectionObserver($.proxy(this.onIntersection, this));
    observer.observe(this.el[0]);
  }

  /**
   * When the element intersects the viewport, check if it is in the viewport
   * and has not yet been processed. If those conditions are true, begin
   * rendering the full size image and the transition process.
   */
  onIntersection(entries, observer) {
    let el = $(entries[0].target);
    if (!entries[0].isIntersecting || $(el).attr(this.processingAttr)) return;
    $(el).attr(this.processingAttr, true);
    this.renderTmpPlaceholderEl();
  }

  // ---------------------------------------- | Main Element

  /**
   * Prepare the main element and its container for optimization.
   */
  initEl() {
    this.setPlaceholderImgUrl();
    this.setContainerTmpCss();
    this.setElTmpCss();
  }

  /**
   * Set reference to original image URL, which is expected to be a small
   * placeholder.
   */
  setPlaceholderImgUrl() {
    this.placeholderImgUrl = this.el
      .css('background-image')
      .replace('url(', '')
      .replace(')', '')
      .replace(/\"/gi, '')
      .replace(/\'/gi, '')
      .split(', ')[0];
  }

  /**
   * The parent of our jumbotron container should be relatively positioned
   * (temporarily) so that we can absolutely position the temp image in the
   * correct location.
   */
  setContainerTmpCss() {
    this.parentStyles = {
      display: this.el.parent().css('display'),
      position: this.el.parent().css('position')
    };
    this.el.parent().css({
      display: 'block',
      position: 'relative'
    });
  }

  /**
   * The main element must have a position set for it to be rendered on top of
   * the temporary full-size image. We assume that if the element is not
   * explicitly positioned absolutely, then it can safely be positioned
   * relatively.
   */
  setElTmpCss() {
    if (this.el.css('position') != 'absolute') {
      this.el.css('position', 'relative');
    }
  }

  // ---------------------------------------- | Placeholder Image (Temp)

  /**
   * Render a clone of the element with the background image directly behind
   * itself.
   */
  renderTmpPlaceholderEl() {
    this.initTmpPlaceholderEl();
    this.setTmpPlaceholderElCss();
    this.addTmpPlaceholderElToDom();
    this.renderFullSizeImg();
  }

  /**
   * Create a clone of the element with the background image. Remove content
   * from the clone -- often elements with a background image contain content.
   */
  initTmpPlaceholderEl() {
    this.tmpPlaceholderEl = this.el.clone();
    this.tmpPlaceholderEl.html('');
  }

  /**
   * Position the clone directly behind the main element
   */
  setTmpPlaceholderElCss() {
    this.tmpPlaceholderEl.addClass('imgix-optimizing');
    this.tmpPlaceholderEl.css({
      position: 'absolute',
      top: this.el.position().top,
      left: this.el.position().left,
      width: this.el.outerWidth(),
      height: this.el.outerHeight(),
      backgroundColor: 'transparent'
    });
  }

  /**
   * Add temporary element to the DOM, directly before the main element
   * containing the background image.
   */
  addTmpPlaceholderElToDom() {
    this.tmpPlaceholderEl.insertBefore(this.el);
  }

  // ---------------------------------------- | Full-Size Image (Temp)

  /**
   * Create another clone, this time of the temporary placeholder image. This
   * new element sits behind the other two and is responsible for loading the
   * full-size image.
   */
  renderFullSizeImg() {
    this.removeElBgImg();
    this.initTmpFullSizeEl();
    this.setTmpFullSizeElImg();
    this.addTmpFullSizeElToDom();
    this.initTransition();
  }

  /**
   * Remove the background color and image from the main element. The user won't
   * notice this transition because the temp duplicate image is already set and
   * is sitting behind the primary element.
   *
   * This also stores a reference to the original background color so we can put
   * it back when the transition is complete.
   */
  removeElBgImg() {
    this.elBgColor = this.el.css('background-color');
    this.el.css('background-color', 'transparent');
    this.el.css('background-image', '');
  }

  /**
   * The temporary full-size element is a clone of the temporary placeholder
   * image element.
   */
  initTmpFullSizeEl() {
    this.tmpFullSizeEl = this.tmpPlaceholderEl.clone();
  }

  /**
   * Sets a reference to the full-size image URL based on the current dimensions
   * of the main element.
   */
  setFullSizeImgUrl() {
    // If the full size image URL exists and if the new size is going to be
    // smaller than the largest size loaded, then we stick with the largest size
    // that has been used.
    if (this.fullSizeImgUrl && this.el.outerWidth() * this.dpr <= this.largestImageWidth) return;
    // Assume that the new width will be the largest size used.
    this.largestImageWidth = this.el.outerWidth() * this.dpr;
    // Work with the placeholder image URL, which has been pulled from the
    // background-image css property of the main elements.
    let url = this.placeholderImgUrl.split('?');
    // q is an array of querystring parameters as ["k=v", "k=v", ...].
    let q = url[url.length - 1].split('&');
    // Mapping q converts the array to an object of querystring parameters as
    // { k: v, k: v, ... }.
    let args = {};
    q.map(x => (args[x.split('=')[0]] = x.split('=')[1]));
    // If the image's container is wider than it is tall, we only set width and
    // unset height, and vice versa.
    if (this.el.outerWidth() >= this.el.outerHeight()) {
      args['w'] = this.largestImageWidth;
      delete args['h'];
    } else {
      args['h'] = this.el.outerHeight() * this.dpr;
      delete args['w'];
    }
    // Redefine q and go the other direction -- take the args object and convert
    // it back to an array of querystring parameters, as ["k=v", "k=v", ...].
    q = [];
    for (let k in args) {
      q.push(`${k}=${args[k]}`);
    }
    // Store the result and return.
    return (this.fullSizeImgUrl = `${url[0]}?${q.join('&')}`);
  }

  /**
   * Change the URL of this temporary element's background image to be the
   * full-size image.
   */
  setTmpFullSizeElImg() {
    this.setFullSizeImgUrl();
    this.tmpFullSizeEl.css('background-image', `url("${this.fullSizeImgUrl}")`);
  }

  /**
   * Add the temporary full-size element direct before the temporary placeholder
   * element.
   */
  addTmpFullSizeElToDom() {
    this.tmpFullSizeEl.insertBefore(this.tmpPlaceholderEl);
  }

  // ---------------------------------------- | Transition

  /**
   * Load full-size image in memory. When it has loaded we can confidentally
   * fade out the placeholder, knowing the full-size image will be in its place.
   */
  initTransition() {
    $('<img>')
      .on('load', $.proxy(this.transitionImg, this))
      .attr('src', this.fullSizeImgUrl);
  }

  /**
   * Fade out the temporary placeholder, set the background-image on the main
   * element to the full-size URL, then remove the temporary elements behind the
   * main element
   */
  transitionImg() {
    this.fadeOutTmpPlaceholderEl();
    setTimeout(() => {
      this.updateElImg();
      this.replaceElTmpCss();
      this.replaceContainerTmpCss();
      this.removeTmpEls();
    }, this.timeToFade);
  }

  /**
   * Fade out the placeholder element. This was the temporary clone of the main
   * element that has a placeholder background image.
   *
   * Rememeber the main element's background image was unset and its color set
   * to transparent. That is why fading out this temporary image will work
   * properly.
   */
  fadeOutTmpPlaceholderEl() {
    this.tmpPlaceholderEl.fadeTo(this.timeToFade, 0);
  }

  /**
   * Reset the image URL (this helps if the size of the element has changed),
   * then set the background image to the new source.
   */
  updateElImg() {
    this.setFullSizeImgUrl();
    $('<img>')
      .on('load', event => this.el.css('background-image', `url('${this.fullSizeImgUrl}')`))
      .attr('src', this.placeholderImgUrl);
  }

  /**
   * Set the background color back to what it was before the transition.
   */
  replaceElTmpCss() {
    this.el.css('background-color', this.elBgColor);
  }

  /**
   * Reset the container's adjusted CSS properties.
   */
  replaceContainerTmpCss() {
    this.el.parent().css({
      display: this.parentStyles.display,
      position: this.parentStyles.position
    });
  }

  /**
   * Remove both temporary elements from the DOM.
   */
  removeTmpEls() {
    this.tmpPlaceholderEl.remove();
    this.tmpFullSizeEl.remove();
    this.tmpPlaceholderEl = undefined;
    this.tmpFullSizeEl = undefined;
  }

  // ---------------------------------------- | Event Listeners

  /**
   * Listener for window resize events and update the image when the event ends.
   */
  initEventListeners() {
    this.initResizeEnd();
    $(window).on('resizeEnd', event => this.updateElImg());
  }

  /**
   * Trigger "resizeEnd" event on the window object after resizing has ceased
   * for at least 0.5 seconds.
   */
  initResizeEnd() {
    $(window).resize(function() {
      if (this.resizeTo) {
        clearTimeout(this.resizeTo);
      }
      this.resizeTo = setTimeout(function() {
        $(this).trigger('resizeEnd');
      }, 500);
    });
  }
}
