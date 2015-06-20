'use strict';

function Game(gameContainer, zoom, lat, lng) {
  var that = this;

  this.players = [];
  this.currentPlayer = null;
  this.socket = io();

  var mapOptions = {
    disableDefaultUI: true,
    zoom: zoom,
    center: {
      lat: lat,
      lng: lng
    }
  };
  this.map = new google.maps.Map(gameContainer, mapOptions);

  this.socket.on('connect', function onConnect () {
    that.socket.emit('Players.join', {
      playerId: user.id
    });
  });

  this.watchHandle = navigator.geolocation.watchPosition(
    function success(pos) {
      that.socket.emit('Players.move', {
        playerId: user.id,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });

      var player = that.currentPlayer || that.setCurrentPlayer(that.addPlayer(that.map, user.id, user.name, user.image));
      player.move(pos.coords.latitude, pos.coords.longitude);
    },
    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}

Game.prototype.setCurrentPlayer = function (player) {
  this.currentPlayer = player;
  return player;
};

Game.prototype.addPlayer = function (map, id, name, image) {
  var player = new Player(map, id, name, image);
  this.players.push(player);
  return player;
};