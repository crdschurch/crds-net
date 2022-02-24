$(document).ready(function() {
  function addToDisplayedEpisodes(episodes) {
    let displayedEpisodes = [];
    for ( let i = 0; i < episodes.length; i++ ) {
      if (!episodes[i].classList.contains('hide-episode')) {
        displayedEpisodes.push(episodes[i]);
      }
    }
    return displayedEpisodes;
  }

  function revealMoreEpisodes(e, episodes) {
    let allEpisodes = document.querySelectorAll(`[data-${e.target.id.slice(0, 8)}]`)
    let displayedEpisodes = addToDisplayedEpisodes(allEpisodes);
  
    for ( let i = displayedEpisodes.length; i < displayedEpisodes.length + 5; i++) {
      if (undefined == episodes[i]) {
        return
      }

      episodes[i].classList.remove("hide-episode");

      if (undefined == episodes[i+1]) {
        document.getElementById(e.target.id).classList.add('hidden');
      }
    }
  }

  function initializeLoadMoreButtons() {
    const totalNumberOfSeasons = document.getElementsByTagName("crds-tabs")[0].attributes.tabs.textContent.replace('\\', '').split(',').length;
    let episodesBySeason = {}

    for ( let i = 0; i < totalNumberOfSeasons; i++ ) {
      let seasonNumber = `${i + 1}`;
      episodesBySeason[seasonNumber] = document.querySelectorAll(`[data-season-${seasonNumber}]`);
      const loadMoreButton = document.getElementById(`season-${seasonNumber}-load-more`);
      loadMoreButton.addEventListener("click", function(e) {
        revealMoreEpisodes(e, episodesBySeason[seasonNumber]);
      }, false);

      loadMoreButton.click();
    }
  }

  initializeLoadMoreButtons();


});
