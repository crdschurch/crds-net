CRDS.HeightWatcher = class HeightWatcher {

  constructor(el) {
    this.el = $(el);
    this.ratio = parseFloat(this.el.data('watch-height-ratio'));

    this.bindEvents();
    this.resize();
  }

  bindEvents() {
    $(window).resize(() => this.resize());
  }

  resize() {
    this.el.outerHeight(this.el.outerWidth() * this.ratio);
  }
}

$(document).ready(function() {
  $('[data-watch-height-ratio]').each(function(idx) {
    new CRDS.HeightWatcher(this);
  });
});
