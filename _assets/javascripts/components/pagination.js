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

  const currentPage = parseInt(document.getElementById("pagination-current-page").getAttribute("placeholder"));
  const protocolAndHost = `${window.location.protocol}//${window.location.host}`
  const totalPaginatedPages = parseInt(document.getElementById("total_pages").innerText);

  function deactivatePreviousButton() {
    document.getElementById("pagination-previous-button").style.display = "none";
  }

  function deactivateNextButton() {
    document.getElementById("pagination-next-button").style.display = "none";
  }

  function checkIfNavigationButtonsNeedDeactivation() {
    if (currentPage == 1) {
      deactivatePreviousButton();
    } else if (currentPage == totalPaginatedPages) {
      deactivateNextButton();
    }
  }


  function paginationInputValue() {
    return parseInt(document.getElementById("pagination-current-page").value);
  }

  function pageIsWithinPaginationBounds() {
    return paginationInputValue() > 1 && paginationInputValue() <= totalPaginatedPages;
  }

  function navigateToPageByInput() {
    if (pageIsWithinPaginationBounds()) {
      const pageToNavigateTo = paginationInputValue();
      window.location.href = `${protocolAndHost}/media/articles/page/${pageToNavigateTo}/`;
    } else if (paginationInputValue() == 1) {
      window.location.href = `${protocolAndHost}/media/articles/`;
    } else {
      console.log('Cant navigate past bounds of paginated collection');
    }
  }

  function moveBackOnePage() {
    if (currentPage > 2) {
      window.location.href = `${protocolAndHost}/media/articles/page/${currentPage - 1}/`;
    } else {
      window.location.href = `${protocolAndHost}/media/articles/`;
    }
  }

  function moveForwardOnePage() {
    if (currentPage < totalPaginatedPages) {
      window.location.href = `${protocolAndHost}/media/articles/page/${parseInt(currentPage) + 1}/`;
    } else {
      window.location.href = `${protocolAndHost}/media/articles/page/${totalPaginatedPages}`;
    }
  }

  checkIfNavigationButtonsNeedDeactivation();

  document.getElementById("pagination-submit-button").addEventListener("click", function(e) {
    navigateToPageByInput()
  }, false);

  document.getElementById("pagination-current-page").addEventListener("keyup", function(e) {
    if (e.key == 'Enter') {
      navigateToPageByInput();
    }
  }, false);

  document.getElementById("pagination-previous-button").addEventListener("click", function(e) {
    moveBackOnePage()
  }, false);

  document.getElementById("pagination-next-button").addEventListener("click", function(e){
    moveForwardOnePage()
  }, false);
});
