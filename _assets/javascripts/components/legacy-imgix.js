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
    const hasLegacyImages = document.getElementsByClassName('imgix-fluid').length > 0;
    const hasOptimizedImages = document.querySelectorAll('[data-optimize-img]').length > 0;
    // load the script if the page only requires legacy support 
    // and has no images using new techniques
    if (hasLegacyImages && !hasOptimizedImages) {
      injectLegacyScript(imgixSrc, function() {
        imgix.fluid()
      });
    }
  }

  legacyImageCheck();
})();
