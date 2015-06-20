$(document).ready(function() {

  /*
   * connect to socket.io
   */
  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
  });

  function success(pos) {
    console.log(pos.coords.latitude + ' ' + pos.coords.longitude);
    if (typeof userId === 'undefined') {
      console.log('not logged in, no socket communication');
      return;
    }
    socket.emit('playerPosition', {
      playerId: userId,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });
//     var position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
//    marker = marker || new google.maps.Marker({map: map, title: 'Du'});
//    marker.setPosition(position);
//    map.panTo(position);
    // navigator.geolocation.clearWatch(id);
  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  var watchHandle = navigator.geolocation.watchPosition(success, error, options);
  // navigator.geolocation.clearWatch(watchHandle);

});