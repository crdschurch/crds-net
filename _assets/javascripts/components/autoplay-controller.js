var options = {
  threshold: 1.0
}

let currentPlayer = null;
let queuedPlayers = [];

observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    let target = getPlayerId(entry.target);
    if (!target) return;
    if (entry.intersectionRatio == 1) {
      if (!currentPlayer) {
        currentPlayer = target.id;
        showOverlayVideo(entry.target);
      } else {
        queuedPlayers.push(target.id);
      }
    } else {
      if (target.id == currentPlayer) {
        showOverlayCard();
        currentPlayer = queuedPlayers.pop();
        if (currentPlayer) {
          showOverlayVideo()
        }
      } else {
        queuedPlayers = queuedPlayers.filter(p => p !== target.id)
      }
    }
  });
}, options);

$("div[id^='bitmovinPlayer']").each(function (i, el) {
  observer.observe(el.parentElement.parentElement);
});

function showOverlayVideo() {
  setTimeout(() => {
    let videoPlayer = document.getElementById(currentPlayer);
    if (!videoPlayer) return; //ppl scroll too fast and video is goneeeee so cancel
    videoContainer = videoPlayer.parentElement;
    hideSiblings(videoContainer);
    videoContainer.style.opacity = '1';
    CRDS[currentPlayer].playVideo();
  }, 1000);
}

function showOverlayCard() {
  CRDS[currentPlayer].pauseVideo();
  let videoContainer = document.getElementById(currentPlayer).parentElement;
  showSiblings(videoContainer);
  videoContainer.style.opacity = '0';
}

function getPlayerId(element) {
  return $(element).find("div[id^='bitmovinPlayer']")[0];
}

function hideSiblings(elem) {
  elem = elem.nextElementSibling;
  while (elem) {
    elem.style.opacity = '0';
    elem = elem.nextElementSibling;
  }
}

function showSiblings(elem) {
  elem = elem.nextElementSibling;
  while (elem) {
    elem.style.opacity = '1';
    elem = elem.nextElementSibling;
  }
}