(function () {
  function transformSource(el) {
    const src = el.dataset.src;
    el.removeAttribute('data-src');
    el.setAttribute('src', src);
  }

  function findLegacyImages() {
    // imgix 2.2.3 uses data-src instead of ix-src
    const legacyImages = document.querySelectorAll('img[data-src]');
    if (legacyImages.length !== 0) {
      console.warn(`${legacyImages.length} images might be using an outdated version of imgix`);
      for (var i = 0; i < legacyImages.length; i += 1) {
        transformSource(legacyImages[i]);
      }
    }
  }

  findLegacyImages();
})();
