window.CRDS = window.CRDS || {};

// ---------------------------------------- Pagination

CRDS.Pagination = function() {
  var links = document.querySelectorAll('button[data-paginate]');
  if(links.length > 0) {
    links.forEach(function(el) {
      new CRDS.PageLoader(el)
    }.bind(this));
  }
}

CRDS.Pagination.prototype.constructor = CRDS.Pagination;

// ---------------------------------------- Loader

CRDS.PageLoader = function(el) {
  this.el = el;
  this.setup();
  this.el.addEventListener('click', this.onClick.bind(this));
}

CRDS.PageLoader.prototype.constructor = CRDS.PageLoader;

CRDS.PageLoader.prototype.setup = function() {
  this.type = $(this.el).data('paginate');
  this.container = $('[data-page="' + this.type + '"]');
  this.page_number = this.container.find('[data-page-number]').last().data('page-number');

  var els = $('ul.pagination[data-pagination='+ this.type +'] a[data-role=page]');
  this.pages = $.makeArray(els.map(function() { return this.getAttribute('href') }));
}

CRDS.PageLoader.prototype.onClick = function(e) {
  e.preventDefault();
  this.page_number++;
  var path = this.getNextPage();
  if(path !== '#' && path !== '') this.loadMore(path);
  return false;
};

CRDS.PageLoader.prototype.getNextPage = function() {
  return this.pages.shift();
};

CRDS.PageLoader.prototype.loadMore = function(path) {
  var h = $(this.container).height();
  var rowh = $(this.container).find('.row').last().height();
  this.container.animate({
    height: (h + rowh),
  }, {
    duration: 400,
    start: function(){
      $('[data-page=' + this.type + '] .loading').removeClass('hide').show();
    }.bind(this),
    complete: function(){
      $.get(path, this.onLoadMore.bind(this));
    }.bind(this)
  });
};

CRDS.PageLoader.prototype.onLoadMore = function(data) {
  var sel = '[data-page="' + this.type + '"]';
  var nextPage = $(data).find(sel).find('[data-page-number]');
  $('[data-page=' + this.type + '] > .loading').hide();
  $(sel).find('[data-page-number]').last().after(nextPage);
  this.activatePage();
  if (typeof Imgix !== 'undefined' && Imgix['Optimizer']) new Imgix.Optimizer();
  this.container.css('height', 'auto');
}

CRDS.PageLoader.prototype.activatePage = function(type) {
  if(CRDS['_instances']['Images']) {
    CRDS['_instances']['Images'].init('[data-page-number=' + this.page_number + ']');
  }
  if(this.pages.length == 0) {
    $(this.el).hide();
  }
}

// ---------------------------------------- Other

$(document).ready(function() {
  new CRDS.Pagination();

  const currentPage = parseInt(paginationInput.getAttribute("placeholder"));
  const host = window.location.host;
  const pageNumber = parseInt(paginationInput.value);
  const paginationInput = document.getElementById("pagination-current-page");
  const paginationNextButton = document.getElementById("pagination-next-button");
  const paginationPrevButton = document.getElementById("pagination-previous-button");
  const paginationSubmitButton = document.getElementById("pagination-submit-button");
  const protocol = window.location.protocol;
  const protocolAndHost = `${protocol}//${host}`
  const totalPaginatedPages = parseInt(document.getElementById("total_pages").innerText);

  paginationSubmitButton.addEventListener("click", function(e) {
    if (pageNumber > 1 && pageNumber <= totalPaginatedPages) {
        window.location.href = `${protocolAndHost}/media/articles/page/${paginationInput.value}/`;
    } else if (pageNumber == 1) {
        window.location.href = `${protocolAndHost}/media/articles/`;
    } else {
      console.log('Cant navigate past bounds of paginated collection');
    }
  }, false);

  paginationInput.addEventListener("keyup", function(e) {
    if (e.key == 'Enter') {
      if (pageNumber > 1 && pageNumber <= totalPaginatedPages) {
          window.location.href = `${protocolAndHost}/media/articles/page/${paginationInput.value}/`;
      } else if (pageNumber == 1) {
          window.location.href = `${protocolAndHost}/media/articles/`;
      } else {
        console.log('Cant navigate past bounds of paginated collection');
      }
    }
  }, false);

  paginationPrevButton.addEventListener("click", function(e) {
    if (currentPage > 2) {
      window.location.href = `${protocolAndHost}/media/articles/page/${currentPage - 1}/`;
    } else {
      window.location.href = `${protocolAndHost}/media/articles/`;
    }
  }, false);

  paginationNextButton.addEventListener("click", function(e) {
    if (currentPage < totalPaginatedPages) {
      window.location.href = `${protocolAndHost}/media/articles/page/${parseInt(currentPage) + 1}/`;
    } else {
      window.location.href = `${protocolAndHost}/media/articles/page/${totalPaginatedPages}`;
    }
  }, false);
});
