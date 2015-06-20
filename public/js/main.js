var game;
$(document).ready(function() {
  if (document.getElementById('map-canvas')) {
    game = new Game(document.getElementById('map-canvas'), 17, 52.5195244, 13.4234489);
  }
});