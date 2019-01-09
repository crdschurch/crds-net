new CRDS.CardCarousels('[data-crds-carousel]');
new CRDS.JumbotronVideos();
new CRDS.CardFilters();
new CRDS.Countdown();
new CRDS.DistanceSorter();
new CRDS.DataTracker();

$.each(CRDS._instances, function (k, v) {
    v.addStyles()
});
$(document).ready(function () {
    $('footer.hidden-print').addClass('flush-top');
    $('.bg-blue-dark ~ p').remove('p');
    $('.ng-scope> .crds-styles> .container-fluid.main> .row> .col-md-12').removeClass('col-md-12');
});
// Scroll Locations
var locationButton = document.getElementById('find-location');
var locationScroll = function (event) {
    event.preventDefault();
    document.getElementById('locations-search').scrollIntoView(true);
}
locationButton.addEventListener('click', locationScroll);

// Jumbotron Overlay
var watchButton = document.getElementById('watch-cta');
var closeButton = document.getElementById('overlay-close');
var overlay = document.getElementById('overlay');

function showOverlay(event) {
    event.preventDefault();
    overlay.classList.add('visible');
}

function hideOverlay() {
    overlay.classList.remove('visible');
}
watchButton.addEventListener('click', showOverlay);
closeButton.addEventListener('click', hideOverlay);
function scroll(myID) {
    var offset = jQuery("#" + myID).offset()
    window.scrollTo(0, offset.top);
}

$(document).ready(function () {
    $('div.modal-video').on('show.bs.modal', function (event) {
        var origSrc = $('#modal-video-src').data('src');
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = origSrc.match(regExp);
        var ytId = (match && (match[7].length == 11 || match[7].length == 12)) ? match[7] : false;
        $('#modal-video-src').attr('src', 'https://www.youtube.com/embed/' + ytId);
    });
    $('div.modal-video').on('hidden.bs.modal', function (event) {
        $('#modal-video-src').attr('src', '');
    });
});

function scroll(myID) {
    var offset = jQuery("#" + myID).offset()
    window.scrollTo(0, offset.top);
}

$('#myTabs a[href="#overview"]').tab('show') // Select tab by name
$('#myTabs a[href="#itinerary"]').tab('show') // Select tab by name
$('#myTabs a[href="#lodging"]').tab('show') // Select tab by name
$('#myTabs a[href="#partner"]').tab('show') // Select tab by name
$('[data-toggle=tab]').on('shown.bs.tab', function (event) { imgix.init(); });