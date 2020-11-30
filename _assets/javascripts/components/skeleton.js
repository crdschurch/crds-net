document.addEventListener('component rendered', function() {
  var els = document.querySelectorAll('[data-component-skeleton]');
  els.forEach(function(el) {
    el.style.display = 'none';
  })
})
