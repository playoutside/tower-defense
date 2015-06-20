var socket;
$(document).ready(function() {
  var map;
  var game = new Game();

  /*
   * connect to socket.io
   */
  socket = io();

  socket.on('connect', function onConnect () {
    socket.emit('Players.join', {
      playerId: user.id
    });
  });

  if (document.getElementById('map-canvas')) {
    var mapOptions = {
      disableDefaultUI: true,
      zoom: 17, // TODO: read from game
      center: { // TODO: read from game
        lat: 52.5195244,
        lng: 13.4234489
      }
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  function success(pos) {
    socket.emit('Players.move', {
      playerId: user.id,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });

    var player = game.currentPlayer || game.setCurrentPlayer(game.addPlayer(map, user.id, user.name, user.image));
    player.move(pos.coords.latitude, pos.coords.longitude);
  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if (typeof user !== 'undefined') { // TODO: add test for running game
    var watchHandle = navigator.geolocation.watchPosition(success, error, options);
    // navigator.geolocation.clearWatch(watchHandle);
  }

});