// Get modal to display after a page loads on Columbus Location

$(document).ready(function() {
  if (document.getElementById('columbus-location-page') != null) {
    const columbusOverlay = document.getElementById('welcomeLocationOverlay');
    columbusOverlay.classList.add('in');
    columbusOverlay.style.display = 'block';
  }
});

// Show overlay 3 times unless interact with
