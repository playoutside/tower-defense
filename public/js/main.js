var socket;
$(document).ready(function() {
  var map;
  var playerMarker;

  /*
   * connect to socket.io
   */
  socket = io.connect(window.location.href);

  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
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

  function newPlayerMarker() {
    var image = {
      url: 'img/character.gif',
      size: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0)
    };
    return new google.maps.Marker({
      map: map,
      title: 'Du'//,
      //icon: image
    });
  }

  function success(pos) {
    console.log(pos.coords.latitude + ' ' + pos.coords.longitude);
    socket.emit('test', {
      playerId: userId,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });

    console.log(map);
    var playerPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    playerMarker = playerMarker || newPlayerMarker();
    playerMarker.setPosition(playerPosition);
  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if (typeof userId !== 'undefined') { // TODO: add test for running game
    var watchHandle = navigator.geolocation.watchPosition(success, error, options);
    // navigator.geolocation.clearWatch(watchHandle);
  }

});