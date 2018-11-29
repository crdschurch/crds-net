if (document.querySelector('simple-fred')) {
  var styles = document.createElement('link');
  var script = document.createElement('script');
  var prefix = CRDS.media.prefix == '' ? '' : '-' + CRDS.media.prefix;
  // setup css
  styles.rel = "stylesheet";
  styles.type = "text"
  styles.href = 'https://unpkg.com/formiojs@3.9.0/dist/formio.full.min.css';
  script.src = '//api'+ prefix +'.crossroads.net/fred/js/simplefred.min.js';
  document.head.insertBefore(script, document.head.childNodes[0]);
  document.head.insertBefore(styles, document.head.childNodes[0]);
}
