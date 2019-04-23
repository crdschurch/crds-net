/* eslist no-plusplus: 0 */
/* global CRDS analytics */

window.CRDS = window.CRDS || {};

CRDS.DataTracker = class DataTracker {
  constructor() {
    this.debug = false;

    if (CRDS._instances["DataTracker"]) {
      this.log("DataTracker already instantiated");
      return CRDS._instances["DataTracker"];
    } else {
      CRDS._instances["DataTracker"] = this;
    }

    this.clickTrackable = undefined;
    this.searchTrackable = undefined;

    if (typeof analytics === "undefined") {
      var int;
      var waitForAnalytics = function() {
        if (typeof analytics !== "undefined") {
          clearInterval(int);
          this.analytics = analytics;
          this.init();
        }
      }.bind(this);
      int = setInterval(function() {
        waitForAnalytics();
      }, 100);
    } else {
      this.analytics = analytics;
      this.init();
    }
  }

  init() {
    this.log("init()");
    this.addClickListeners();
    this.addSearchListeners();
  }

  addClickListeners() {
    this.log("addClickListeners()");
    this.clickTrackable = document.querySelectorAll("[data-track-click]");
    for (let i = 0; i < this.clickTrackable.length; i += 1) {
      this.clickTrackable[i].addEventListener(
        "click",
        this.handleClick.bind(this)
      );
    }
  }

  addSearchListeners() {
    this.log("addSearchListeners()");
    this.searchTrackable = document.querySelectorAll("[data-track-search]");
    for (let x = 0; x < this.searchTrackable.length; x += 1) {
      this.searchTrackable[x].addEventListener(
        "submit",
        this.handleSearch.bind(this)
      );
    }
  }

  handleClick(event) {
    this.log("handleClick()");
    const el = event.currentTarget;
    const name = el.dataset.trackClick || el.id || "Unnamed Click Event";
    const label = el.dataset.trackLabel || "ElementClicked";
    const target = el.outerHTML;
    const type = el.nodeName;
    this.handleTrack(label, {
      Name: name,
      Target: target,
      Type: type
    });
  }

  handleSearch(event) {
    this.log("handleSearch()");
    event.preventDefault();
    const form = event.currentTarget;
    const searchInput = form.getElementsByTagName("input")[0];
    const name = form.dataset.trackSearch || form.id || "Unnamed Search";
    const label = form.dataset.trackLabel || "SearchRequested";
    const target = form.outerHTML;
    const search = searchInput.value;
    this.handleTrack(label, {
      Name: name,
      Target: target,
      SearchTerm: search
    });
  }

  handleTrack(label, properties) {
    this.log("handleTrack()");
    var callAnalytics = setInterval(function () {
      if(this.analytics !== undefined){
        this.analytics.track(label, properties);
        clearInterval(callAnalytics);
      }
    }, 200);
  }

  log(str) {
    if (this.debug) {
      console.log(str);
    }
  }
};

$(document).ready(function() {
  new CRDS.DataTracker();
});
