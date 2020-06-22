// if (document.querySelector("simple-fred")) {
//   // wrap <simple-fred> in required <p> tag
//   wrapSimpleFred();
//
//   // setup FRED Script
//   var script = document.createElement("script");
//   var prefix = CRDS.media.prefix == "" ? "" : "-" + CRDS.media.prefix;
//   script.src = "//api" + prefix + ".crossroads.net/fred/js/simplefred.min.js";
//   document.head.insertBefore(script, document.head.childNodes[0]);
//
//   // get latest styles and write inline styles
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", "https://unpkg.com/formiojs@latest/dist/formio.full.min.css");
//   xhr.send(null);
//   xhr.onreadystatechange = function() {
//     var DONE = 4; // readyState 4 means the request is done.
//     var OK = 200; // status 200 is a successful return.
//     if (xhr.readyState === DONE) {
//       if (xhr.status === OK) createInlineStyles(xhr.responseText);
//     } else {
//       console.log("Error: " + xhr.status);
//     }
//   };
//
//   function createInlineStyles(res) {
//     var styles = document.createElement("style");
//     styles.innerText = res;
//     document.head.insertBefore(styles, document.head.childNodes[0]);
//   }
//
//   function wrapSimpleFred() {
//     var el = document.querySelector("simple-fred");
//     var wrapper = document.createElement("p");
//     el.parentNode.insertBefore(wrapper, el);
//     wrapper.appendChild(el);
//   }
// }
