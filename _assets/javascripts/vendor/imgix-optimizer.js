(function() {
  "use strict";

  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var Image = (function() {
    function Image(img) {
      classCallCheck(this, Image);

      // Length of crossfade transition.
      this.timeToFade = 500;
      // Data attribute applied before processing.
      this.processingAttr = "data-imgix-img-processed";
      // The main image (pixelated placeholder).
      this.placeholderImg = $(img);
      // Tracks state of the transition so some actions don't fire during the
      // transition period.
      this.transitioning = false;
      // Wait for the image to load prior to kicking off the optimization process.
      if (this.placeholderImg.height() > 0) {
        this.init();
      } else {
        this.placeholderImg.on("load", $.proxy(this.init, this));
      }
    }

    /**
     * Configure the main placeholder image and kick off the optimization process.
     */

    createClass(Image, [
      {
        key: "init",
        value: function init() {
          this.initPlaceholder();
          this.initOptimization();
        }

        /**
         * Load an image in memory (not within the DOM) with the same source as the
         * placeholder image. Once that has completed, we know we're safe to begin
         * listening for the image to intersect the viewport.
         */
      },
      {
        key: "initOptimization",
        value: function initOptimization() {
          $("<img>")
            .on("load", $.proxy(this.listenForIntersection, this))
            .attr("src", this.placeholderImg.attr("src"));
        }

        // ---------------------------------------- | Lazy Loading Control

        /**
         * When the placeholder image intersects the viewport, begin processing.
         * (IntersectionObserver and Object.assign() are not supported by IE, but the
         * polyfills are loaded by Imgix.Optimizer.)
         */
      },
      {
        key: "listenForIntersection",
        value: function listenForIntersection() {
          var observer = new IntersectionObserver(
            $.proxy(this.onIntersection, this)
          );
          observer.observe(this.placeholderImg[0]);
        }

        /**
         * When the placeholder image intersects the viewport, check if it is in the
         * viewport and has not yet been processed. If those conditions are true,
         * begin rendering the full size image and the transition process.
         */
      },
      {
        key: "onIntersection",
        value: function onIntersection(entries, observer) {
          var img = $(entries[0].target);
          if (!entries[0].isIntersecting || $(img).attr(this.processingAttr))
            return;
          img.attr(this.processingAttr, true);
          this.renderFullSizeImg();
        }

        // ---------------------------------------- | Placeholder Image

        /**
         * Make necessary CSS adjustments to main placeholder image and listen for
         * changes.
         */
      },
      {
        key: "initPlaceholder",
        value: function initPlaceholder() {
          this.wrapPlaceholder();
          this.setPlaceholderCss();
          $(window).resize($.proxy(this.rewrapPlaceholder, this));
        }

        /**
         * Wrap the placeholder image in a <div>. This enables better control over the
         * wrapping element and provides a more fluid transition process.
         */
      },
      {
        key: "wrapPlaceholder",
        value: function wrapPlaceholder() {
          var margin =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : null;

          this.tmpWrapper = $("<div>").css({
            display: "inline-block",
            position: "relative",
            height: this.placeholderImg[0].getBoundingClientRect().height,
            width: this.placeholderImg[0].getBoundingClientRect().width,
            margin: margin || this.placeholderImg.css("margin")
          });
          this.placeholderImg.wrap(this.tmpWrapper);
        }

        /**
         * The main image must have a position set for it to remain in front of the
         * full-size image. We assume that if the element is not explicitly positioned
         * absolutely, then it can safely be positioned relatively.
         *
         * And temporarily remove any margin from the image, as the box model gets
         * delegated to the temporary wrapper during the transition period.
         */
      },
      {
        key: "setPlaceholderCss",
        value: function setPlaceholderCss() {
          if (this.placeholderImg.css("position") != "absolute") {
            this.placeholderImg.css("position", "relative");
          }
          this.placeholderImg.css({ margin: 0 });
        }

        /**
         * If the transition has not yet happened, figure out the margin of the
         * wrapper, then unwrap and rewrap. This resets the size of the wrapper so it
         * doesn't overflow after resize events.
         */
      },
      {
        key: "rewrapPlaceholder",
        value: function rewrapPlaceholder() {
          if (this.transitioning || !this.placeholderImg) return true;
          var wrapperMargin = this.tmpWrapper.css("margin");
          this.placeholderImg.unwrap();
          this.wrapPlaceholder(wrapperMargin);
        }

        // ---------------------------------------- | Full-Size Image

        /**
         * Render the full-size image behind the placeholder image.
         */
      },
      {
        key: "renderFullSizeImg",
        value: function renderFullSizeImg() {
          this.rewrapPlaceholder();
          this.transitioning = true;
          this.initFullSizeImg();
          this.setFullSizeImgTempCss();
          this.setFullSizeImgSrc();
          this.addFullSizeImgToDom();
          this.initTransition();
        }

        /**
         * The full-size image is a clone of the placeholder image. This enables us to
         * easily replace it without losing any necessary styles or attributes.
         */
      },
      {
        key: "initFullSizeImg",
        value: function initFullSizeImg() {
          this.fullSizeImg = this.placeholderImg.clone();
        }

        /**
         * Give the full-size image a temporary set of CSS rules so that it can sit
         * directly behind the placeholder image while loading.
         */
      },
      {
        key: "setFullSizeImgTempCss",
        value: function setFullSizeImgTempCss() {
          this.fullSizeImg.css({
            position: "absolute",
            top: this.placeholderImg.position().top,
            left: this.placeholderImg.position().left,
            width: "100%",
            height: "100%"
          });
        }

        /**
         * Return the width and height of the placeholder image, including decimals.
         * Uses precise measurements like this helps ensure the element doesn't slide
         * when transitioning to the full size image.
         */
      },
      {
        key: "getPlaceholderImgRect",
        value: function getPlaceholderImgRect() {
          return {
            width: this.placeholderImg[0].getBoundingClientRect().width,
            height: this.placeholderImg[0].getBoundingClientRect().height
          };
        }

        /**
         * Prep the full-size image with the attributes necessary to become its full
         * size. Right now it is still just a replica of the placeholder, sitting
         * right behind the placeholder.
         *
         * We set the src directly even though we're using imgix.js because older
         * browsers don't support the srcset attribute which is what imgix.js relies
         * upon.
         */
      },
      {
        key: "setFullSizeImgSrc",
        value: function setFullSizeImgSrc() {
          var newSrc = this.placeholderImg
            .attr("src")
            .replace(
              /(\?|\&)(w=)(\d+)/i,
              "$1$2" + this.getPlaceholderImgRect().width
            )
            .replace(
              /(\?|\&)(h=)(\d+)/i,
              "$1$2" + this.getPlaceholderImgRect().height
            );
          // Add a height attribute if it is missing. This is the key to the image not
          // jumping around after transitioning to the full-size image.
          if (newSrc.search(/(\?|\&)(h=)(\d+)/i) < 0) {
            newSrc =
              newSrc +
              "&h=" +
              this.getPlaceholderImgRect().height +
              "&fit=crop";
          }
          this.fullSizeImg.attr("ix-src", newSrc);
          // TODO: Make this a configurable option or document it as a more semantic temporary class
          this.fullSizeImg.addClass("img-responsive imgix-optimizing");
          // TODO: This should respect the option from the Optimizer class for the select
          this.fullSizeImg.removeAttr("data-optimize-img");
        }

        /**
         * Render the full-size image in the DOM.
         */
      },
      {
        key: "addFullSizeImgToDom",
        value: function addFullSizeImgToDom() {
          this.fullSizeImg.insertBefore(this.placeholderImg);
        }

        // ---------------------------------------- | Image Transition

        /**
         * Once the full-size image is loaded, begin the transition. This is the
         * critical piece of this process. Imgix.js uses the ix-src attribute to build
         * out the srcset attribute. Then, based on the sizes attribute, the browser
         * determines which source to render. Therefore we can't preload in memory
         * because we need imgix to do its thing directly in the DOM.
         */
      },
      {
        key: "initTransition",
        value: function initTransition() {
          var _this = this;

          this.fullSizeImg.on("load", function() {
            return _this.transitionImg();
          });
          imgix.init();
        }

        /**
         * Fade out the placeholder image, effectively showing the image behind it.
         *
         * Once the fade out transition has completed, remove any temporary properties
         * from the full-size image (so it gets back to being a clone of the
         * placeholder, with the full-size src).
         *
         * Finally, remove the placeholder image from the DOM since we don't need it
         * any more.
         */
      },
      {
        key: "transitionImg",
        value: function transitionImg() {
          var _this2 = this;

          if (!this.placeholderImg) return true;
          this.fadeOutPlaceholder();
          setTimeout(function() {
            _this2.removeFullSizeImgProperties();
            _this2.removePlaceholderImg();
            _this2.unwrapImg();
            _this2.transitioning = false;
          }, this.timeToFade);
        }

        /**
         * Fade out the placeholder image.
         */
      },
      {
        key: "fadeOutPlaceholder",
        value: function fadeOutPlaceholder() {
          this.placeholderImg.fadeTo(this.timeToFade, 0);
        }

        /**
         * Remove temporary styles and class from the full-size image, which
         * effectively means it has replaced the placeholder image.
         */
      },
      {
        key: "removeFullSizeImgProperties",
        value: function removeFullSizeImgProperties() {
          this.fullSizeImg.removeAttr("style");
          // TODO: Update this with how the class is handled above.
          this.fullSizeImg.removeClass("imgix-optimizing");
        }

        /**
         * Remove the placeholder image from the DOM since we no longer need it.
         */
      },
      {
        key: "removePlaceholderImg",
        value: function removePlaceholderImg() {
          if (!this.placeholderImg) {
            return;
          }
          this.placeholderImg.remove();
          this.placeholderImg = undefined;
        }

        /**
         * Remove the temporary wrapper and and give the margin back to the image.
         */
      },
      {
        key: "unwrapImg",
        value: function unwrapImg() {
          this.fullSizeImg
            .css("margin", this.tmpWrapper.css("margin"))
            .unwrap();
        }
      }
    ]);
    return Image;
  })();

  var BackgroundImage = (function() {
    function BackgroundImage(el) {
      classCallCheck(this, BackgroundImage);

      // Length of time to complete fade-in transition.
      this.timeToFade = 500;
      // Data attribute applied before processing.
      this.processingAttr = "data-imgix-bg-processed";
      // Device pixel ratio assumes 1 if not set.
      this.dpr = window["devicePixelRatio"] || 1;
      // The largest image that has been loaded. This assumes the height of the
      // container will not change.
      this.largestImageWidth = 0;
      // The primary element (i.e. the one with the background image).
      this.el = $(el);
      // Background image CSS property must be present.
      if (this.el.css("background-image") == "none") {
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

    createClass(BackgroundImage, [
      {
        key: "initOptimization",
        value: function initOptimization() {
          $("<img>")
            .on("load", $.proxy(this.listenForIntersection, this))
            .attr("src", this.placeholderImgUrl);
        }

        /**
         * When the element intersects the viewport, begin processing.
         * (IntersectionObserver and Object.assign() are not supported by IE, but the
         * polyfills are loaded by Imgix.Optimizer.)
         */
      },
      {
        key: "listenForIntersection",
        value: function listenForIntersection() {
          var observer = new IntersectionObserver(
            $.proxy(this.onIntersection, this)
          );
          observer.observe(this.el[0]);
        }

        /**
         * When the element intersects the viewport, check if it is in the viewport
         * and has not yet been processed. If those conditions are true, begin
         * rendering the full size image and the transition process.
         */
      },
      {
        key: "onIntersection",
        value: function onIntersection(entries, observer) {
          var el = $(entries[0].target);
          if (!entries[0].isIntersecting || $(el).attr(this.processingAttr))
            return;
          $(el).attr(this.processingAttr, true);
          this.renderTmpPlaceholderEl();
        }

        // ---------------------------------------- | Main Element

        /**
         * Prepare the main element and its container for optimization.
         */
      },
      {
        key: "initEl",
        value: function initEl() {
          this.setPlaceholderImgUrl();
          this.setContainerTmpCss();
          this.setElTmpCss();
        }

        /**
         * Set reference to original image URL, which is expected to be a small
         * placeholder.
         */
      },
      {
        key: "setPlaceholderImgUrl",
        value: function setPlaceholderImgUrl() {
          this.placeholderImgUrl = this.el
            .css("background-image")
            .replace("url(", "")
            .replace(")", "")
            .replace(/\"/gi, "")
            .replace(/\'/gi, "")
            .split(", ")[0];
        }

        /**
         * The parent of our jumbotron container should be relatively positioned
         * (temporarily) so that we can absolutely position the temp image in the
         * correct location.
         */
      },
      {
        key: "setContainerTmpCss",
        value: function setContainerTmpCss() {
          this.parentStyles = {
            display: this.el.parent().css("display"),
            position: this.el.parent().css("position")
          };
          this.el.parent().css({
            display: "block",
            position: "relative"
          });
        }

        /**
         * The main element must have a position set for it to be rendered on top of
         * the temporary full-size image. We assume that if the element is not
         * explicitly positioned absolutely, then it can safely be positioned
         * relatively.
         */
      },
      {
        key: "setElTmpCss",
        value: function setElTmpCss() {
          if (this.el.css("position") != "absolute") {
            this.el.css("position", "relative");
          }
        }

        // ---------------------------------------- | Placeholder Image (Temp)

        /**
         * Render a clone of the element with the background image directly behind
         * itself.
         */
      },
      {
        key: "renderTmpPlaceholderEl",
        value: function renderTmpPlaceholderEl() {
          this.initTmpPlaceholderEl();
          this.setTmpPlaceholderElCss();
          this.addTmpPlaceholderElToDom();
          this.renderFullSizeImg();
        }

        /**
         * Create a clone of the element with the background image. Remove content
         * from the clone -- often elements with a background image contain content.
         */
      },
      {
        key: "initTmpPlaceholderEl",
        value: function initTmpPlaceholderEl() {
          this.tmpPlaceholderEl = this.el.clone();
          this.tmpPlaceholderEl.html("");
        }

        /**
         * Position the clone directly behind the main element
         */
      },
      {
        key: "setTmpPlaceholderElCss",
        value: function setTmpPlaceholderElCss() {
          this.tmpPlaceholderEl.addClass("imgix-optimizing");
          this.tmpPlaceholderEl.css({
            position: "absolute",
            top: this.el.position().top,
            left: this.el.position().left,
            width: this.el.outerWidth(),
            height: this.el.outerHeight(),
            backgroundColor: "transparent"
          });
        }

        /**
         * Add temporary element to the DOM, directly before the main element
         * containing the background image.
         */
      },
      {
        key: "addTmpPlaceholderElToDom",
        value: function addTmpPlaceholderElToDom() {
          this.tmpPlaceholderEl.insertBefore(this.el);
        }

        // ---------------------------------------- | Full-Size Image (Temp)

        /**
         * Create another clone, this time of the temporary placeholder image. This
         * new element sits behind the other two and is responsible for loading the
         * full-size image.
         */
      },
      {
        key: "renderFullSizeImg",
        value: function renderFullSizeImg() {
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
      },
      {
        key: "removeElBgImg",
        value: function removeElBgImg() {
          this.elBgColor = this.el.css("background-color");
          this.el.css("background-color", "transparent");
          this.el.css("background-image", "");
        }

        /**
         * The temporary full-size element is a clone of the temporary placeholder
         * image element.
         */
      },
      {
        key: "initTmpFullSizeEl",
        value: function initTmpFullSizeEl() {
          this.tmpFullSizeEl = this.tmpPlaceholderEl.clone();
        }

        /**
         * Sets a reference to the full-size image URL based on the current dimensions
         * of the main element.
         */
      },
      {
        key: "setFullSizeImgUrl",
        value: function setFullSizeImgUrl() {
          // If the full size image URL exists and if the new size is going to be
          // smaller than the largest size loaded, then we stick with the largest size
          // that has been used.
          if (
            this.fullSizeImgUrl &&
            this.el.outerWidth() * this.dpr <= this.largestImageWidth
          )
            return;
          // Assume that the new width will be the largest size used.
          this.largestImageWidth = this.el.outerWidth() * this.dpr;
          // Work with the placeholder image URL, which has been pulled from the
          // background-image css property of the main elements.
          var url = this.placeholderImgUrl.split("?");
          // q is an array of querystring parameters as ["k=v", "k=v", ...].
          var q = url[url.length - 1].split("&");
          // Mapping q converts the array to an object of querystring parameters as
          // { k: v, k: v, ... }.
          var args = {};
          q.map(function(x) {
            return (args[x.split("=")[0]] = x.split("=")[1]);
          });
          // If the image's container is wider than it is tall, we only set width and
          // unset height, and vice versa.
          if (this.el.outerWidth() >= this.el.outerHeight()) {
            args["w"] = this.largestImageWidth;
            delete args["h"];
          } else {
            args["h"] = this.el.outerHeight() * this.dpr;
            delete args["w"];
          }
          // Redefine q and go the other direction -- take the args object and convert
          // it back to an array of querystring parameters, as ["k=v", "k=v", ...].
          q = [];
          for (var k in args) {
            q.push(k + "=" + args[k]);
          }
          // Store the result and return.
          return (this.fullSizeImgUrl = url[0] + "?" + q.join("&"));
        }

        /**
         * Change the URL of this temporary element's background image to be the
         * full-size image.
         */
      },
      {
        key: "setTmpFullSizeElImg",
        value: function setTmpFullSizeElImg() {
          this.setFullSizeImgUrl();
          this.tmpFullSizeEl.css(
            "background-image",
            'url("' + this.fullSizeImgUrl + '")'
          );
        }

        /**
         * Add the temporary full-size element direct before the temporary placeholder
         * element.
         */
      },
      {
        key: "addTmpFullSizeElToDom",
        value: function addTmpFullSizeElToDom() {
          this.tmpFullSizeEl.insertBefore(this.tmpPlaceholderEl);
        }

        // ---------------------------------------- | Transition

        /**
         * Load full-size image in memory. When it has loaded we can confidentally
         * fade out the placeholder, knowing the full-size image will be in its place.
         */
      },
      {
        key: "initTransition",
        value: function initTransition() {
          $("<img>")
            .on("load", $.proxy(this.transitionImg, this))
            .attr("src", this.fullSizeImgUrl);
        }

        /**
         * Fade out the temporary placeholder, set the background-image on the main
         * element to the full-size URL, then remove the temporary elements behind the
         * main element
         */
      },
      {
        key: "transitionImg",
        value: function transitionImg() {
          var _this = this;

          this.fadeOutTmpPlaceholderEl();
          setTimeout(function() {
            _this.updateElImg();
            _this.replaceElTmpCss();
            _this.replaceContainerTmpCss();
            _this.removeTmpEls();
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
      },
      {
        key: "fadeOutTmpPlaceholderEl",
        value: function fadeOutTmpPlaceholderEl() {
          this.tmpPlaceholderEl.fadeTo(this.timeToFade, 0);
        }

        /**
         * Reset the image URL (this helps if the size of the element has changed),
         * then set the background image to the new source.
         */
      },
      {
        key: "updateElImg",
        value: function updateElImg() {
          var _this2 = this;

          this.setFullSizeImgUrl();
          $("<img>")
            .on("load", function(event) {
              return _this2.el.css(
                "background-image",
                "url('" + _this2.fullSizeImgUrl + "')"
              );
            })
            .attr("src", this.placeholderImgUrl);
        }

        /**
         * Set the background color back to what it was before the transition.
         */
      },
      {
        key: "replaceElTmpCss",
        value: function replaceElTmpCss() {
          this.el.css("background-color", this.elBgColor);
        }

        /**
         * Reset the container's adjusted CSS properties.
         */
      },
      {
        key: "replaceContainerTmpCss",
        value: function replaceContainerTmpCss() {
          this.el.parent().css({
            display: this.parentStyles.display,
            position: this.parentStyles.position
          });
        }

        /**
         * Remove both temporary elements from the DOM.
         */
      },
      {
        key: "removeTmpEls",
        value: function removeTmpEls() {
          this.tmpPlaceholderEl.remove();
          this.tmpFullSizeEl.remove();
          this.tmpPlaceholderEl = undefined;
          this.tmpFullSizeEl = undefined;
        }

        // ---------------------------------------- | Event Listeners

        /**
         * Listener for window resize events and update the image when the event ends.
         */
      },
      {
        key: "initEventListeners",
        value: function initEventListeners() {
          var _this3 = this;

          this.initResizeEnd();
          $(window).on("resizeEnd", function(event) {
            return _this3.updateElImg();
          });
        }

        /**
         * Trigger "resizeEnd" event on the window object after resizing has ceased
         * for at least 0.5 seconds.
         */
      },
      {
        key: "initResizeEnd",
        value: function initResizeEnd() {
          $(window).resize(function() {
            if (this.resizeTo) {
              clearTimeout(this.resizeTo);
            }
            this.resizeTo = setTimeout(function() {
              $(this).trigger("resizeEnd");
            }, 500);
          });
        }
      }
    ]);
    return BackgroundImage;
  })();

  /**
   * Copyright 2016 Google Inc. All Rights Reserved.
   *
   * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
   *
   *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
   *
   */

  (function(window, document) {
    // Exits early if all IntersectionObserver and IntersectionObserverEntry
    // features are natively supported.
    if (
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype
    ) {
      // Minimal polyfill for Edge 15's lack of `isIntersecting`
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      if (!("isIntersecting" in window.IntersectionObserverEntry.prototype)) {
        Object.defineProperty(
          window.IntersectionObserverEntry.prototype,
          "isIntersecting",
          {
            get: function() {
              return this.intersectionRatio > 0;
            }
          }
        );
      }
      return;
    }

    /**
     * Creates the global IntersectionObserverEntry constructor.
     * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
     * @param {Object} entry A dictionary of instance properties.
     * @constructor
     */
    function IntersectionObserverEntry(entry) {
      this.time = entry.time;
      this.target = entry.target;
      this.rootBounds = entry.rootBounds;
      this.boundingClientRect = entry.boundingClientRect;
      this.intersectionRect = entry.intersectionRect || getEmptyRect();
      this.isIntersecting = !!entry.intersectionRect;

      // Calculates the intersection ratio.
      var targetRect = this.boundingClientRect;
      var targetArea = targetRect.width * targetRect.height;
      var intersectionRect = this.intersectionRect;
      var intersectionArea = intersectionRect.width * intersectionRect.height;

      // Sets intersection ratio.
      if (targetArea) {
        // Round the intersection ratio to avoid floating point math issues:
        // https://github.com/w3c/IntersectionObserver/issues/324
        this.intersectionRatio = Number(
          (intersectionArea / targetArea).toFixed(4)
        );
      } else {
        // If area is zero and is intersecting, sets to 1, otherwise to 0
        this.intersectionRatio = this.isIntersecting ? 1 : 0;
      }
    }

    /**
     * Creates the global IntersectionObserver constructor.
     * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
     * @param {Function} callback The function to be invoked after intersection
     *     changes have queued. The function is not invoked if the queue has
     *     been emptied by calling the `takeRecords` method.
     * @param {Object=} opt_options Optional configuration options.
     * @constructor
     */
    function IntersectionObserver(callback, opt_options) {
      var options = opt_options || {};

      if (typeof callback != "function") {
        throw new Error("callback must be a function");
      }

      if (options.root && options.root.nodeType != 1) {
        throw new Error("root must be an Element");
      }

      // Binds and throttles `this._checkForIntersections`.
      this._checkForIntersections = throttle(
        this._checkForIntersections.bind(this),
        this.THROTTLE_TIMEOUT
      );

      // Private properties.
      this._callback = callback;
      this._observationTargets = [];
      this._queuedEntries = [];
      this._rootMarginValues = this._parseRootMargin(options.rootMargin);

      // Public properties.
      this.thresholds = this._initThresholds(options.threshold);
      this.root = options.root || null;
      this.rootMargin = this._rootMarginValues
        .map(function(margin) {
          return margin.value + margin.unit;
        })
        .join(" ");
    }

    /**
     * The minimum interval within which the document will be checked for
     * intersection changes.
     */
    IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;

    /**
     * The frequency in which the polyfill polls for intersection changes.
     * this can be updated on a per instance basis and must be set prior to
     * calling `observe` on the first target.
     */
    IntersectionObserver.prototype.POLL_INTERVAL = null;

    /**
     * Use a mutation observer on the root element
     * to detect intersection changes.
     */
    IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;

    /**
     * Starts observing a target element for intersection changes based on
     * the thresholds values.
     * @param {Element} target The DOM element to observe.
     */
    IntersectionObserver.prototype.observe = function(target) {
      var isTargetAlreadyObserved = this._observationTargets.some(function(
        item
      ) {
        return item.element == target;
      });

      if (isTargetAlreadyObserved) {
        return;
      }

      if (!(target && target.nodeType == 1)) {
        throw new Error("target must be an Element");
      }

      this._registerInstance();
      this._observationTargets.push({ element: target, entry: null });
      this._monitorIntersections();
      this._checkForIntersections();
    };

    /**
     * Stops observing a target element for intersection changes.
     * @param {Element} target The DOM element to observe.
     */
    IntersectionObserver.prototype.unobserve = function(target) {
      this._observationTargets = this._observationTargets.filter(function(
        item
      ) {
        return item.element != target;
      });
      if (!this._observationTargets.length) {
        this._unmonitorIntersections();
        this._unregisterInstance();
      }
    };

    /**
     * Stops observing all target elements for intersection changes.
     */
    IntersectionObserver.prototype.disconnect = function() {
      this._observationTargets = [];
      this._unmonitorIntersections();
      this._unregisterInstance();
    };

    /**
     * Returns any queue entries that have not yet been reported to the
     * callback and clears the queue. This can be used in conjunction with the
     * callback to obtain the absolute most up-to-date intersection information.
     * @return {Array} The currently queued entries.
     */
    IntersectionObserver.prototype.takeRecords = function() {
      var records = this._queuedEntries.slice();
      this._queuedEntries = [];
      return records;
    };

    /**
     * Accepts the threshold value from the user configuration object and
     * returns a sorted array of unique threshold values. If a value is not
     * between 0 and 1 and error is thrown.
     * @private
     * @param {Array|number=} opt_threshold An optional threshold value or
     *     a list of threshold values, defaulting to [0].
     * @return {Array} A sorted list of unique and valid threshold values.
     */
    IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
      var threshold = opt_threshold || [0];
      if (!Array.isArray(threshold)) threshold = [threshold];

      return threshold.sort().filter(function(t, i, a) {
        if (typeof t != "number" || isNaN(t) || t < 0 || t > 1) {
          throw new Error(
            "threshold must be a number between 0 and 1 inclusively"
          );
        }
        return t !== a[i - 1];
      });
    };

    /**
     * Accepts the rootMargin value from the user configuration object
     * and returns an array of the four margin values as an object containing
     * the value and unit properties. If any of the values are not properly
     * formatted or use a unit other than px or %, and error is thrown.
     * @private
     * @param {string=} opt_rootMargin An optional rootMargin value,
     *     defaulting to '0px'.
     * @return {Array<Object>} An array of margin objects with the keys
     *     value and unit.
     */
    IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
      var marginString = opt_rootMargin || "0px";
      var margins = marginString.split(/\s+/).map(function(margin) {
        var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
        if (!parts) {
          throw new Error("rootMargin must be specified in pixels or percent");
        }
        return { value: parseFloat(parts[1]), unit: parts[2] };
      });

      // Handles shorthand.
      margins[1] = margins[1] || margins[0];
      margins[2] = margins[2] || margins[0];
      margins[3] = margins[3] || margins[1];

      return margins;
    };

    /**
     * Starts polling for intersection changes if the polling is not already
     * happening, and if the page's visibility state is visible.
     * @private
     */
    IntersectionObserver.prototype._monitorIntersections = function() {
      if (!this._monitoringIntersections) {
        this._monitoringIntersections = true;

        // If a poll interval is set, use polling instead of listening to
        // resize and scroll events or DOM mutations.
        if (this.POLL_INTERVAL) {
          this._monitoringInterval = setInterval(
            this._checkForIntersections,
            this.POLL_INTERVAL
          );
        } else {
          addEvent(window, "resize", this._checkForIntersections, true);
          addEvent(document, "scroll", this._checkForIntersections, true);

          if (this.USE_MUTATION_OBSERVER && "MutationObserver" in window) {
            this._domObserver = new MutationObserver(
              this._checkForIntersections
            );
            this._domObserver.observe(document, {
              attributes: true,
              childList: true,
              characterData: true,
              subtree: true
            });
          }
        }
      }
    };

    /**
     * Stops polling for intersection changes.
     * @private
     */
    IntersectionObserver.prototype._unmonitorIntersections = function() {
      if (this._monitoringIntersections) {
        this._monitoringIntersections = false;

        clearInterval(this._monitoringInterval);
        this._monitoringInterval = null;

        removeEvent(window, "resize", this._checkForIntersections, true);
        removeEvent(document, "scroll", this._checkForIntersections, true);

        if (this._domObserver) {
          this._domObserver.disconnect();
          this._domObserver = null;
        }
      }
    };

    /**
     * Scans each observation target for intersection changes and adds them
     * to the internal entries queue. If new entries are found, it
     * schedules the callback to be invoked.
     * @private
     */
    IntersectionObserver.prototype._checkForIntersections = function() {
      var rootIsInDom = this._rootIsInDom();
      var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

      this._observationTargets.forEach(function(item) {
        var target = item.element;
        var targetRect = getBoundingClientRect(target);
        var rootContainsTarget = this._rootContainsTarget(target);
        var oldEntry = item.entry;
        var intersectionRect =
          rootIsInDom &&
          rootContainsTarget &&
          this._computeTargetAndRootIntersection(target, rootRect);

        var newEntry = (item.entry = new IntersectionObserverEntry({
          time: now(),
          target: target,
          boundingClientRect: targetRect,
          rootBounds: rootRect,
          intersectionRect: intersectionRect
        }));

        if (!oldEntry) {
          this._queuedEntries.push(newEntry);
        } else if (rootIsInDom && rootContainsTarget) {
          // If the new entry intersection ratio has crossed any of the
          // thresholds, add a new entry.
          if (this._hasCrossedThreshold(oldEntry, newEntry)) {
            this._queuedEntries.push(newEntry);
          }
        } else {
          // If the root is not in the DOM or target is not contained within
          // root but the previous entry for this target had an intersection,
          // add a new record indicating removal.
          if (oldEntry && oldEntry.isIntersecting) {
            this._queuedEntries.push(newEntry);
          }
        }
      }, this);

      if (this._queuedEntries.length) {
        this._callback(this.takeRecords(), this);
      }
    };

    /**
     * Accepts a target and root rect computes the intersection between then
     * following the algorithm in the spec.
     * TODO(philipwalton): at this time clip-path is not considered.
     * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
     * @param {Element} target The target DOM element
     * @param {Object} rootRect The bounding rect of the root after being
     *     expanded by the rootMargin value.
     * @return {?Object} The final intersection rect object or undefined if no
     *     intersection is found.
     * @private
     */
    IntersectionObserver.prototype._computeTargetAndRootIntersection = function(
      target,
      rootRect
    ) {
      // If the element isn't displayed, an intersection can't happen.
      if (window.getComputedStyle(target).display == "none") return;

      var targetRect = getBoundingClientRect(target);
      var intersectionRect = targetRect;
      var parent = getParentNode(target);
      var atRoot = false;

      while (!atRoot) {
        var parentRect = null;
        var parentComputedStyle =
          parent.nodeType == 1 ? window.getComputedStyle(parent) : {};

        // If the parent isn't displayed, an intersection can't happen.
        if (parentComputedStyle.display == "none") return;

        if (parent == this.root || parent == document) {
          atRoot = true;
          parentRect = rootRect;
        } else {
          // If the element has a non-visible overflow, and it's not the <body>
          // or <html> element, update the intersection rect.
          // Note: <body> and <html> cannot be clipped to a rect that's not also
          // the document rect, so no need to compute a new intersection.
          if (
            parent != document.body &&
            parent != document.documentElement &&
            parentComputedStyle.overflow != "visible"
          ) {
            parentRect = getBoundingClientRect(parent);
          }
        }

        // If either of the above conditionals set a new parentRect,
        // calculate new intersection data.
        if (parentRect) {
          intersectionRect = computeRectIntersection(
            parentRect,
            intersectionRect
          );

          if (!intersectionRect) break;
        }
        parent = getParentNode(parent);
      }
      return intersectionRect;
    };

    /**
     * Returns the root rect after being expanded by the rootMargin value.
     * @return {Object} The expanded root rect.
     * @private
     */
    IntersectionObserver.prototype._getRootRect = function() {
      var rootRect;
      if (this.root) {
        rootRect = getBoundingClientRect(this.root);
      } else {
        // Use <html>/<body> instead of window since scroll bars affect size.
        var html = document.documentElement;
        var body = document.body;
        rootRect = {
          top: 0,
          left: 0,
          right: html.clientWidth || body.clientWidth,
          width: html.clientWidth || body.clientWidth,
          bottom: html.clientHeight || body.clientHeight,
          height: html.clientHeight || body.clientHeight
        };
      }
      return this._expandRectByRootMargin(rootRect);
    };

    /**
     * Accepts a rect and expands it by the rootMargin value.
     * @param {Object} rect The rect object to expand.
     * @return {Object} The expanded rect.
     * @private
     */
    IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
      var margins = this._rootMarginValues.map(function(margin, i) {
        return margin.unit == "px"
          ? margin.value
          : (margin.value * (i % 2 ? rect.width : rect.height)) / 100;
      });
      var newRect = {
        top: rect.top - margins[0],
        right: rect.right + margins[1],
        bottom: rect.bottom + margins[2],
        left: rect.left - margins[3]
      };
      newRect.width = newRect.right - newRect.left;
      newRect.height = newRect.bottom - newRect.top;

      return newRect;
    };

    /**
     * Accepts an old and new entry and returns true if at least one of the
     * threshold values has been crossed.
     * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
     *    particular target element or null if no previous entry exists.
     * @param {IntersectionObserverEntry} newEntry The current entry for a
     *    particular target element.
     * @return {boolean} Returns true if a any threshold has been crossed.
     * @private
     */
    IntersectionObserver.prototype._hasCrossedThreshold = function(
      oldEntry,
      newEntry
    ) {
      // To make comparing easier, an entry that has a ratio of 0
      // but does not actually intersect is given a value of -1
      var oldRatio =
        oldEntry && oldEntry.isIntersecting
          ? oldEntry.intersectionRatio || 0
          : -1;
      var newRatio = newEntry.isIntersecting
        ? newEntry.intersectionRatio || 0
        : -1;

      // Ignore unchanged ratios
      if (oldRatio === newRatio) return;

      for (var i = 0; i < this.thresholds.length; i++) {
        var threshold = this.thresholds[i];

        // Return true if an entry matches a threshold or if the new ratio
        // and the old ratio are on the opposite sides of a threshold.
        if (
          threshold == oldRatio ||
          threshold == newRatio ||
          threshold < oldRatio !== threshold < newRatio
        ) {
          return true;
        }
      }
    };

    /**
     * Returns whether or not the root element is an element and is in the DOM.
     * @return {boolean} True if the root element is an element and is in the DOM.
     * @private
     */
    IntersectionObserver.prototype._rootIsInDom = function() {
      return !this.root || containsDeep(document, this.root);
    };

    /**
     * Returns whether or not the target element is a child of root.
     * @param {Element} target The target element to check.
     * @return {boolean} True if the target element is a child of root.
     * @private
     */
    IntersectionObserver.prototype._rootContainsTarget = function(target) {
      return containsDeep(this.root || document, target);
    };

    /**
     * Adds the instance to the global IntersectionObserver registry if it isn't
     * already present.
     * @private
     */
    IntersectionObserver.prototype._registerInstance = function() {};

    /**
     * Removes the instance from the global IntersectionObserver registry.
     * @private
     */
    IntersectionObserver.prototype._unregisterInstance = function() {};

    /**
     * Returns the result of the performance.now() method or null in browsers
     * that don't support the API.
     * @return {number} The elapsed time since the page was requested.
     */
    function now() {
      return window.performance && performance.now && performance.now();
    }

    /**
     * Throttles a function and delays its execution, so it's only called at most
     * once within a given time period.
     * @param {Function} fn The function to throttle.
     * @param {number} timeout The amount of time that must pass before the
     *     function can be called again.
     * @return {Function} The throttled function.
     */
    function throttle(fn, timeout) {
      var timer = null;
      return function() {
        if (!timer) {
          timer = setTimeout(function() {
            fn();
            timer = null;
          }, timeout);
        }
      };
    }

    /**
     * Adds an event handler to a DOM node ensuring cross-browser compatibility.
     * @param {Node} node The DOM node to add the event handler to.
     * @param {string} event The event name.
     * @param {Function} fn The event handler to add.
     * @param {boolean} opt_useCapture Optionally adds the even to the capture
     *     phase. Note: this only works in modern browsers.
     */
    function addEvent(node, event, fn, opt_useCapture) {
      if (typeof node.addEventListener == "function") {
        node.addEventListener(event, fn, opt_useCapture || false);
      } else if (typeof node.attachEvent == "function") {
        node.attachEvent("on" + event, fn);
      }
    }

    /**
     * Removes a previously added event handler from a DOM node.
     * @param {Node} node The DOM node to remove the event handler from.
     * @param {string} event The event name.
     * @param {Function} fn The event handler to remove.
     * @param {boolean} opt_useCapture If the event handler was added with this
     *     flag set to true, it should be set to true here in order to remove it.
     */
    function removeEvent(node, event, fn, opt_useCapture) {
      if (typeof node.removeEventListener == "function") {
        node.removeEventListener(event, fn, opt_useCapture || false);
      } else if (typeof node.detatchEvent == "function") {
        node.detatchEvent("on" + event, fn);
      }
    }

    /**
     * Returns the intersection between two rect objects.
     * @param {Object} rect1 The first rect.
     * @param {Object} rect2 The second rect.
     * @return {?Object} The intersection rect or undefined if no intersection
     *     is found.
     */
    function computeRectIntersection(rect1, rect2) {
      var top = Math.max(rect1.top, rect2.top);
      var bottom = Math.min(rect1.bottom, rect2.bottom);
      var left = Math.max(rect1.left, rect2.left);
      var right = Math.min(rect1.right, rect2.right);
      var width = right - left;
      var height = bottom - top;

      return (
        width >= 0 &&
        height >= 0 && {
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          width: width,
          height: height
        }
      );
    }

    /**
     * Shims the native getBoundingClientRect for compatibility with older IE.
     * @param {Element} el The element whose bounding rect to get.
     * @return {Object} The (possibly shimmed) rect of the element.
     */
    function getBoundingClientRect(el) {
      var rect;

      try {
        rect = el.getBoundingClientRect();
      } catch (err) {
        // Ignore Windows 7 IE11 "Unspecified error"
        // https://github.com/w3c/IntersectionObserver/pull/205
      }

      if (!rect) return getEmptyRect();

      // Older IE
      if (!(rect.width && rect.height)) {
        rect = {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        };
      }
      return rect;
    }

    /**
     * Returns an empty rect object. An empty rect is returned when an element
     * is not in the DOM.
     * @return {Object} The empty rect.
     */
    function getEmptyRect() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }

    /**
     * Checks to see if a parent element contains a child element (including inside
     * shadow DOM).
     * @param {Node} parent The parent element.
     * @param {Node} child The child element.
     * @return {boolean} True if the parent node contains the child node.
     */
    function containsDeep(parent, child) {
      var node = child;
      while (node) {
        if (node == parent) return true;

        node = getParentNode(node);
      }
      return false;
    }

    /**
     * Gets the parent node of an element or its host element if the parent node
     * is a shadow root.
     * @param {Node} node The node whose parent to get.
     * @return {Node|null} The parent node or null if no parent exists.
     */
    function getParentNode(node) {
      var parent = node.parentNode;

      if (parent && parent.nodeType == 11 && parent.host) {
        // If the parent is a shadow root, return the host element.
        return parent.host;
      }
      return parent;
    }

    // Exposes the constructors globally.
    window.IntersectionObserver = IntersectionObserver;
    window.IntersectionObserverEntry = IntersectionObserverEntry;
  })(window, document);

  if (typeof Object.assign != "function") {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) {
        if (target == null) {
          // TypeError if undefined or null
          throw new TypeError("Cannot convert undefined or null to object");
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  var Optimizer = (function() {
    function Optimizer() {
      var options =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, Optimizer);

      this.initDependencies();
      this.initOptions(options);
      this.optimizeImages();
      this.optimizeBgImages();
    }

    // ---------------------------------------- | Dependencies

    createClass(Optimizer, [
      {
        key: "initDependencies",
        value: function initDependencies() {}

        // ---------------------------------------- | Options
      },
      {
        key: "initOptions",
        value: function initOptions() {
          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          this.options = options;
          var defaultOptions = {
            parent: "body"
          };
          for (var key in defaultOptions) {
            if (defaultOptions.hasOwnProperty(key) && !this.options[key]) {
              this.options[key] = defaultOptions[key];
            }
          }
        }

        // ---------------------------------------- | Inline Images
      },
      {
        key: "optimizeImages",
        value: function optimizeImages() {
          $(this.options.parent + " img[data-optimize-img]").each(function(
            idx,
            img
          ) {
            new Image(img);
          });
        }

        // ---------------------------------------- | Background Images
      },
      {
        key: "optimizeBgImages",
        value: function optimizeBgImages() {
          $(this.options.parent + " [data-optimize-bg-img]").each(function(
            idx,
            img
          ) {
            new BackgroundImage(img);
          });
          return true;
        }
      }
    ]);
    return Optimizer;
  })();

  window["Imgix"] = window["Imgix"] || {};

  Imgix.Optimizer = Optimizer;
})();
