var player;

let videoElement = document.querySelector('#yt-wrap');

if (videoElement) {
  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/player_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  // 3. This function creates an <iframe> (and YouTube player)
  // after the API code downloads.;

  let playerId = videoElement.getAttribute('player-id');
  
  window.onYouTubePlayerAPIReady = () => {
    player = new YT.Player('ytplayer', {
      width: '100%',
      height: '100%',
      videoId: playerId,
      playerVars: {
        'autoplay': 1,
        'showinfo': 0,
        'autohide': 1,
        'loop': 1,
        'controls': 0,
        'modestbranding': 1,
        'vq': 'hd1080'
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }; 
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    player.seekTo(0);
    player.playVideo();
  }
}

var muteButton = document.getElementById('mute-btn');
var muteIcon = document.getElementById('volume-slash');
var soundIcon = document.getElementById('volume-up');
var hidden = 'hidden-icon';
var display = 'icon-video';

if (muteButton) {
  muteButton.addEventListener('click', function () {
    if (player.isMuted()) {
      player.unMute();
    } else {
      player.mute();
    }
  });
}

if (muteButton) {
  muteButton.addEventListener('click', function () {  
    if (muteIcon.classList.contains(hidden)) {
      muteIcon.classList.add(display);
      muteIcon.classList.remove(hidden);
      soundIcon.classList.add(hidden);
      soundIcon.classList.remove(display);
    } else {
      soundIcon.classList.add(display);
      soundIcon.classList.remove(hidden);
      muteIcon.classList.add(hidden);
      muteIcon.classList.remove(display);
    }
  });
}
