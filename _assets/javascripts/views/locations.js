new CRDS.CardCarousels('[data-crds-carousel]');
new CRDS.CardFilters();

function scrollToSection() {
  var section = document.getElementById('happenings')
  section.scrollIntoView({behavior: "smooth"});
}

function scroll(myID){
  var offset = jQuery("#"+myID).offset()
  window.scrollTo(0,offset.top);
}
