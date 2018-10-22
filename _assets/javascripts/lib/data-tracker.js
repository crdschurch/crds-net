/* eslist no-plusplus: 0 */
/* global CRDS analytics */

window.CRDS = window.CRDS || {};

CRDS.DataTracker = class DataTracker {
  constructor() {
    this.clickTrackable = undefined;
    this.searchTrackable = undefined;

    if(typeof analytics === "undefined") {
      var int;
      var waitForAnalytics = function() {
        if(typeof analytics !== "undefined") {
          clearInterval(int);
          this.analytics = analytics;
          this.init();
        }
      }.bind(this);
      int = setInterval(function() { waitForAnalytics(); }, 100);
    } else {
      this.analytics = analytics;
      this.init();
    }
  }

  init() {
    this.addClickListeners();
    this.addSearchListeners();
  }

  addClickListeners() {
    this.clickTrackable = document.querySelectorAll('[data-track-click]');
    for (let i = 0; i < this.clickTrackable.length; i += 1) {
      this.clickTrackable[i].addEventListener('click', this.handleClick.bind(this));
    }
  }

  addSearchListeners() {
    this.searchTrackable = document.querySelectorAll('[data-track-search]');
    for (let x = 0; x < this.searchTrackable.length; x += 1) {
      this.searchTrackable[x].addEventListener('submit', this.handleSearch.bind(this));
    }
  }

  handleClick(event) {
    const el = event.currentTarget;
    const name = el.dataset.trackClick || el.id || 'Unnamed Click Event';
    const target = el.outerHTML;
    const type = el.nodeName;
    this.handleTrack ('ElementClicked', {
      Name: name,
      Target: target,
      Type: type
    });
  }

  handleSearch(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const searchInput = form.getElementsByTagName('input')[0];
    const name = form.dataset.trackSearch || form.id || 'Unnamed Search';
    const target = form.outerHTML;
    const search = searchInput.value;
    this.handleTrack ('SearchRequested', {
      Name: name,
      Target: target,
      SearchTerm: search
    });
  }

  handleTrack(label, properties) {
    this.analytics.track(label, properties);
  }
};