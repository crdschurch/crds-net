(function () {
  const imgixSrc = 'https://cdn.rawgit.com/imgix/imgix.js/2.2.3/dist/imgix.min.js';
  const imgixVersion = '2.2.3';
  function injectLegacyScript(src, callback) {
    const script = document.createElement('script');
    script.onload = function() {
      callback();
    };

    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
    console.log(`loaded legacy imgix version: ${imgixVersion}`);
  }

  function legacyImageCheck() {
    document.getElementsByClassName('imgix-fluid').length > 0 
      ? injectLegacyScript(imgixSrc, function() {
        imgix.fluid()
      }) : '';
  }

  legacyImageCheck();
})();
