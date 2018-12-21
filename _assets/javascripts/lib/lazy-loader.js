/* eslist no-plusplus: 0 */
/* jshint esversion: 6 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.LazyLoader = class LazyLoader {
  constructor() {
    this.items = undefined;
    this.container = undefined;
    this.config = {
      // root: container,
      rootMargin: '0px 0px',
      threshold: [0]
    }
    this.init();
  }

  init() {
    this.items = document.querySelectorAll('img');
    this.container = document.querySelector('body');
    // create observer rule set
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // if the item is above threshold (any pixels are visible)
        if (entry.isIntersecting > 0) {
          this.load(entry.target);
        } else {
          entry.target.classList.remove('is-visible');
        }
      })
    }, this.config);

    // attach to all items
    this.attachObserver(this.items, this.observer);
  }

  attachObserver(arr, observer) {
    arr.forEach((item) => {
      observer.observe(item)
    });
  }

  load(item) {
    item.classList.add('is-visible');
  }
}

new CRDS.LazyLoader();
