'use strict';

function Game(gameContainer, zoom, lat, lng) {
  var that = this;

  this.players = {};
  this.towers = {};
  this.currentPlayer = null;
  this.socket = io();
  this.path = null;

  var mapOptions = {
    disableDefaultUI: true,
    zoom: zoom,
    center: {
      lat: lat,
      lng: lng
    },
    styles: [{"elementType": "labels.text", "stylers": [{"visibility": "off"}]}, {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#f5f5f2"}, {"visibility": "on"}]
    }, {"featureType": "administrative", "stylers": [{"visibility": "off"}]}, {
      "featureType": "transit",
      "stylers": [{"visibility": "off"}]
    }, {"featureType": "poi.attraction", "stylers": [{"visibility": "off"}]}, {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#ffffff"}, {"visibility": "on"}]
    }, {"featureType": "poi.business", "stylers": [{"visibility": "off"}]}, {
      "featureType": "poi.medical",
      "stylers": [{"visibility": "off"}]
    }, {"featureType": "poi.place_of_worship", "stylers": [{"visibility": "off"}]}, {
      "featureType": "poi.school",
      "stylers": [{"visibility": "off"}]
    }, {"featureType": "poi.sports_complex", "stylers": [{"visibility": "off"}]}, {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{"color": "#ffffff"}, {"visibility": "simplified"}]
    }, {
      "featureType": "road.arterial",
      "stylers": [{"visibility": "simplified"}, {"color": "#ffffff"}]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [{"color": "#ffffff"}, {"visibility": "off"}]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    }, {"featureType": "road.arterial", "stylers": [{"color": "#ffffff"}]}, {
      "featureType": "road.local",
      "stylers": [{"color": "#ffffff"}]
    }, {
      "featureType": "poi.park",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    }, {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    }, {"featureType": "water", "stylers": [{"color": "#71c8d4"}]}, {
      "featureType": "landscape",
      "stylers": [{"color": "#e5e8e7"}]
    }, {"featureType": "poi.park", "stylers": [{"color": "#8ba129"}]}, {
      "featureType": "road",
      "stylers": [{"color": "#ffffff"}]
    }, {
      "featureType": "poi.sports_complex",
      "elementType": "geometry",
      "stylers": [{"color": "#c7c7c7"}, {"visibility": "off"}]
    }, {"featureType": "water", "stylers": [{"color": "#a0d3d3"}]}, {
      "featureType": "poi.park",
      "stylers": [{"color": "#91b65d"}]
    }, {"featureType": "poi.park", "stylers": [{"gamma": 1.51}]}, {
      "featureType": "road.local",
      "stylers": [{"visibility": "off"}]
    }, {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{"visibility": "on"}]
    }, {
      "featureType": "poi.government",
      "elementType": "geometry",
      "stylers": [{"visibility": "off"}]
    }, {"featureType": "landscape", "stylers": [{"visibility": "off"}]}, {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [{"visibility": "off"}]
    }, {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{"visibility": "simplified"}]
    }, {
      "featureType": "road.local",
      "stylers": [{"visibility": "simplified"}]
    }, {"featureType": "road"}, {"featureType": "road"}, {}, {"featureType": "road.highway"}]
  };
  this.map = new google.maps.Map(gameContainer, mapOptions);

  this.socket.on('connect', function onConnect () {
    that.socket.emit('Players.join', {
      playerId: user.id
    });
  });

  this.socket.on('Game.fullStatus', function onFullStatus(data) {
    console.log(data);

    var pathCoordinates = [];
    _.each(data.level.path, function(pathCoordinatesPair, index) {
      pathCoordinates.push(new google.maps.LatLng(pathCoordinatesPair.lat, pathCoordinatesPair.lon));
    });

     var path = new google.maps.Polyline({
     path: pathCoordinates,
     geodesic: true,
     strokeColor: '#6fcdde',
     strokeOpacity: 1.0,
     strokeWeight: 5
     });

     path.setMap(that.map);

    _.each(data.level.turretSites, function(turretSite, index) {
      that.addTower(index, turretSite.position.lat, turretSite.position.lon);
    });
  });

  this.watchHandle = navigator.geolocation.watchPosition(
    function success(pos) {
      that.socket.emit('Players.move', {
        playerId: user.id,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });

      var player = that.currentPlayer || that.setCurrentPlayer(that.addPlayer(user.id, user.name, user.image));
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

Game.prototype.addPlayer = function (id, name, image) {
  var player = new Player(this.map, id, name, image);
  this.players[id] = player;
  return player;
};

Game.prototype.addTower = function (id, lat, lng) {
  var tower = new Tower(this.map, id, lat, lng);
  this.towers[id] = tower;
  return tower;
};