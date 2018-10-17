if (document.querySelector('simple-fred')) {
  var script = document.createElement('script');
  var prefix = CRDS.media.prefix == '' ? '' : '-' + CRDS.media.prefix;
  script.src = '//api'+ prefix +'.crossroads.net/fred/js/simplefred.min.js';
  document.head.insertBefore(script, document.head.childNodes[0]);
}
