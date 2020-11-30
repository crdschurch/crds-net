window.CRDS = window.CRDS || {};

// ----------------------------------------------- #
/* global CRDS Mustache */

CRDS.CardFilters = class CardFilters {
  constructor(selector = undefined) {
    this.selector = selector || '[data-filterable]';
    if (typeof Mustache === 'object') {
      this.init();
    } else {
      CardFilters.loadScript('https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js', this.init.bind(this));
    }
  }

  static loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }

  init() {
    this.cardFilters = [];
    const els = document.querySelectorAll(this.selector);
    for (let i = 0; i < els.length; i += 1) {
      this.cardFilters[i] = new CRDS.CardFilter(els[i]);
    }
  }
};

// ----------------------------------------------- #

CRDS.CardFilter = class CardFilter {
  constructor(el) {
    this.el = el;
    this.container = document.querySelector(this.el.dataset.filterParent) ? document.querySelector(this.el.dataset.filterParent) : this.el;
    this.filter_label = this.el.dataset.filterLabel || 'Filter By Location...';
    this.reset_label = this.el.dataset.filterResetLabel || false;
    this.init();
    this.setup();
  }

  init() {
    this.els = this.el.querySelectorAll('[data-filter]');
    this.els = Array.prototype.slice.call(this.els);

    // Get unique filters
    this.filters = this.els.reduce((acc, card) => acc.concat(card.getAttribute('data-filter').split(',')), []).filter((item, i, ar) => item && ar.indexOf(item) === i);
  }

  setup() {
    // if reset_label matches a filter, put it first and treat as default
    const resetIndex = this.filters.indexOf(this.reset_label);
    let filterOnLoad = false;
    if (resetIndex > -1) {
      this.filters.splice(resetIndex, 1);
      this.filters.unshift(this.reset_label);
      this.reset_label = false;
      filterOnLoad = true;
    }
    const args = {
      label: this.filter_label,
      reset: this.reset_label,
      filters: this.filters
    };
    const el = document.createElement('DIV');
    el.classList.add('dropdown', 'pull-right', 'push-half-left');
    el.dataset.automationId = 'happenings-dropdown';
    el.innerHTML = Mustache.render(CardFilter.filterHTML(), args);

    const links = el.querySelectorAll('a');

    for (let i = 0; i < links.length; i += 1) {
      links[i].addEventListener('click', this.click.bind(this));
    }

    this.container.insertBefore(el, this.container.childNodes[0]);

    if (filterOnLoad) {
      this.performFilter(this.filters[0]);
    }
  }

  click(e) {
    e.preventDefault();
    const filter = e.currentTarget.dataset.filterSelect;
    const reset = e.currentTarget.dataset.reset;
    if (this.currentFilter !== filter && filter !== undefined) {
      this.performFilter(filter);
    } else if (reset !== undefined) {
      this.resetFilter();
    }
    CardFilter.activateFilter(e.currentTarget);
  }

  performFilter(filter) {
    this.currentFilter = filter;
    this.setCurrentLabel(filter);

    for (let i = 0; i < this.els.length; i += 1) {
      const el = this.els[i];
      const filters = el.getAttribute('data-filter').split(',');
      el.style.display = filters.indexOf(filter) !== -1 ? 'block' : 'none';
    }
    this.refreshCarousel();
  }

  resetFilter() {
    this.setCurrentLabel(this.reset_label);
    for (let i = 0; i < this.els.length; i += 1) {
      this.els[i].style.display = 'block';
    }
    this.refreshCarousel();
  }

  static activateFilter(el = undefined) {
    const siblings = el.parentNode.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i += 1) {
      siblings[i].querySelector('a').classList.remove('on');
    }
    if (el) {
      el.classList.add('on');
    }
    if (imgix) {
      imgix.init();
    }
  }

  setCurrentLabel(str) {
    this.container.querySelector('[data-current-label]').innerText = str;
  }

  refreshCarousel() {
    if (this.el.dataset.crdsCarousel !== undefined) {
      const id = this.el.dataset.carouselId;
      CRDS._instances[id].reload();
    }
  }

  static filterHTML() {
    const id = Math.random().toString(36).substring(7);
    return `<button class="btn btn-outline btn-gray-light dropdown-toggle soft-half-sides soft-quarter-ends" type="button" id="dropdownMenu-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><svg class="icon icon-1 pull-right push-left" viewBox="0 0 256 256"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svgs/icons.svg#chevron-down"></use></svg> <span data-current-label>{{label}}</span></button><ul class="crds-list dropdown-menu" aria-labelledby="dropdownMenu-${id}">{{#reset}}<li><a href="#" data-reset>{{reset}}</a></li>{{/reset}}{{#filters}}<li><a href="#" data-filter-select="{{.}}" class="block">{{.}}</a>{{/filters}}</li></ul>`;
  }
};
