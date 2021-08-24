$('#videoModal').on('hidden.bs.modal', function(e) {
  $('#videoModal iframe').attr('src', $('#videoModal iframe').attr('src'));
});

var video = document.getElementById('modalVideo');
function stopVideo() {
  video.pause();
  video.currentTime = 0;
}

$('.stop-video').on('click', function() {
  stopVideo();
});
