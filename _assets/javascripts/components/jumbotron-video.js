(function() {
  window.$(document).ready(function() {
    new window.CRDS.JumbotronVideos();

    // ---------------------------------------- Prevent bg video from loading on mobile
    const bgVideo = document.getElementById('jumbotron-bg-video');

    if (bgVideo) {
      const mediaQuery = window.matchMedia('(min-width: 480px)');
      mediaQuery.addEventListener('change', handleScreenChange);

      // Check screen size on load
      handleScreenChange(mediaQuery);
    }

    function handleScreenChange(e) {
      if (e.matches) {
        bgVideo.setAttribute('src', bgVideo.getAttribute('data-src'));
      } else if (!bgVideo.hasAttribute('data-src')) {
        bgVideo.setAttribute('data-src', bgVideo.getAttribute('src'));
      }
    }
  });
})();
