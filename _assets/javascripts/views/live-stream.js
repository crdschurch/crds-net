// if live-stream loads first
document.addEventListener("deferred-js-ready", liveStreamInit);

// if app-deferred loads first
if (window.deferredJSReady) {
  liveStreamInit();
}

function liveStreamInit() {
  // IFrame Resizer (for Give section)
  // iFrameResize({
  //   heightCalculationMethod: 'taggedElement',
  //   minHeight: 350,
  //   checkOrigin: false
  // }, '#giveIframe');

  var dontMissCards = document.getElementsByClassName(
    ".carousel--dont-miss .card"
  );
  for (var i = 0; i < dontMissCards.length; i += 1) {
    dontMissCards[i].classList.add("carousel-cell");
  }

  // Buttons for Card Carousel
  $(".btn.carousel-prev").on("click", function() {
    var id = $(this)
      .closest(".well")
      .find(".card-deck.carousel")
      .data("carousel-id");
    var carousel = CRDS._instances[id];
    carousel.flickity.previous();
  });
  $(".btn.carousel-next").on("click", function() {
    var id = $(this)
      .closest(".well")
      .find(".card-deck.carousel")
      .data("carousel-id");
    var carousel = CRDS._instances[id];
    carousel.flickity.next();
  });

  var search = window.location.search.substring(1);
  var debug = false;
  if (search) {
    var params = JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
    debug = params.debug == "true";
  }

  CRDS.Countdown.isStreamLive().then(function(isLive) {
    if (!isLive && !debug) {
      window.location.href = "/live";
    }
  });

  window.env = window.env || {};
  env.rollcallFormId =
    "1FAIpQLScrO2WZ-ODPL5mJktWXBc283_MWH7RF3fFok2qUtMGzCorhKg";
  env.rollcallFormUrl =
    "/forms/d/e/1FAIpQLScrO2WZ-ODPL5mJktWXBc283_MWH7RF3fFok2qUtMGzCorhKg/formResponse";
  env.rollcallFormKeys = {
    total: "entry.1403910056",
    zip: "entry.692424241",
    lng: "entry.1547032910",
    lat: "entry.1874873182",
    context: "entry.644514730",
  };
}
