if (document.querySelector('simple-fred')) {
  var script = document.createElement('script');
  script.src = '//api-int.crossroads.net/fred/js/simplefred.min.js';
  document.head.insertBefore(script, document.head.childNodes[0]);
}
