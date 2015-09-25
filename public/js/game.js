'use strict';

function Game(gameContainer, zoom, lat, lng) {
  var that = this;

  this.players = {};
  this.towers = {};
  this.creeps = {};
  this.bullets = {};
  this.bulletCounter = 0;
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

  this.socket.on('connect', function onConnect() {
    that.socket.emit('Players.join', {
      playerId: user.id
    });
  });

  var updateCreeps = function updateCreeps(creeps) {
    _.each(creeps, function (creep) {
      if (_.has(that.creeps, creep.id)) {
        that.creeps[creep.id].move(creep.pos.lat, creep.pos.lon, creep.hitPoints);
      } else {
        that.addCreep(creep.id, creep.pos.lat, creep.pos.lon, creep.hitPoints);
      }
    });
  };

  window.setInterval(function() {
      var now = Date.now();
      _.each(that.bullets, function(bullet) {
        if (now - bullet.created < 500) {
          bullet.remove();
          delete(that.bullets[bullet.id]);
        }
      }, that);
    },
    200
  );

  this.socket.on('Game.fullStatus', function onFullStatus(data) {
    console.log('Game.fullStatus', data);

    var pathCoordinates = [];
    var bounds = new google.maps.LatLngBounds();

    _.each(data.level.path, function (pathCoordinatesPair, index) {
      pathCoordinates.push(new google.maps.LatLng(pathCoordinatesPair.lat, pathCoordinatesPair.lon));
      bounds.extend(new google.maps.LatLng(pathCoordinatesPair.lat, pathCoordinatesPair.lon));
    });

/*    // clean up creeps
    _.each(that.creeps, function (creep) {
      creep.remove();
    });

    // cleanup players
    _.each(that.players, function (player) {
      player.remove();
    });

    // cleanup towers
    _.each(that.towers, function (tower) {
      tower.remove();
    });*/

    var path = that.path || new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#6fcdde',
      strokeOpacity: 1.0,
      strokeWeight: 5
    });

    path.setMap(that.map);

    that.map.fitBounds(bounds);
    that.map.panToBounds(bounds);

    _.each(data.level.turretSites, function (turretSite, index) {
      that.addTower(index, turretSite.position.lat, turretSite.position.lon, turretSite.tower);
    });

    _.each(data.Players, function(data) {
      if (data.playerId != user.id) {
        that.addPlayer(data.playerId, data.name, data.image);
        if (data.pos.lat) {
          that.players[data.playerId].move(data.pos.lat, data.pos.lon);
        }
      }
    });

    $('.hud .wave').html('Wave: ' + data.wave);
    $('.hud .lives').html('Lives: ' + data.health);
    $('.hud .credits').html('Credits: ' + data.credits);
  });

  this.socket.on('Players.pos', function playerChangedPosition(data) {
    that.players[data.playerId].move(data.latitude, data.longitude);
  });

  this.socket.on('Players.join', function newPlayerJoined(data) {
    new PNotify({text: 'Player "' + data.name + '" joined.'});
    that.addPlayer(data.playerId, data.name, data.image);
  });

  this.socket.on('Players.disconnect', function playerDisconnected(data) {
    new PNotify({text: 'Player "' + that.players[data.playerId].name + '" left.'});
    that.removePlayer(data.playerId);
  });

  this.socket.on('Players.health', function playerHealth(health) {
    //new PNotify({text: 'Creep could hit and took a life.'});
    $('.hud .lives').html('Lives: ' + health);
  });

  this.socket.on('Players.credits', function playerCredits(credits) {
    $('.hud .credits').html('Credits: ' + credits);
  });

  this.socket.on('Players.message', function playerMessage (message) {
    new PNotify({text: message});
  });

  this.socket.on('Player.actionAvailable', function playerActionAvailable(data) {
    if (data.length === 0) {
      $('.game-actions').empty();
      return;
    }

    $('.game-actions button').attr('data-delete', 'true');

    var button;
    _.each(data, function (option) {
      button = $('.game-actions button[data-action="' + option.action + '"][data-lat="' + option.position.lat + '"][data-lon="' + option.position.lon + '"]');
      if (button.length === 0) {
        $('<button type="button"/>')
          .addClass('btn btn-' + (option.action == 'Towers.build' ? 'warning' : 'danger'))
          .attr('data-action', option.action)
          .attr('data-lat', option.position.lat)
          .attr('data-lon', option.position.lon)
          .attr('data-tower-id', option.towerId)
          .append(
          $('<i>')
            .addClass('fa fa-' + (option.action == 'Towers.build' ? 'gavel' : 'level-up'))
        )
          .on('click', function () {
            that.socket.emit($(this).attr('data-action'), {
              playerId: user.id,
              lat: $(this).attr('data-lat'),
              lon: $(this).attr('data-lon'),
              towerId: $(this).attr('data-tower-id')
            });
          })
          .appendTo('.game-actions');
      } else {
        button.attr('data-delete', 'false');
      }
    });

    $('.game-actions button[data-delete="true"]').remove();
  });

  this.socket.on('Tower.build', function onTowerBuild(data) {
    var tower = _.find(that.towers, function (tower) {
      return tower.lat == data.lat && tower.lng == data.lon;
    });
    tower.build();
  });

  this.socket.on('Tower.fire', function onTowerFire(data) {
    that.fire(data.turret.lat, data.turret.lon, data.creep.lat, data.creep.lon);
  });

  this.socket.on('Tower.status', function updateTower(data) {
    console.log('tower changed', data);

    that.updateTower(data);
  });

  this.socket.on('Creeps.status', updateCreeps);

  this.socket.on('Creeps.remove', function (creeps) {
    _.each(creeps, function (creep) {
      that.removeCreep(creep.id);
    });
  });

  this.socket.on('Creeps.newWave', function (data) {
    //new PNotify({text: 'Wave ' + data.wave + ' started.'});
    $('.hud .wave').html('Wave: ' + data.wave);
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

Game.prototype.removePlayer = function (id) {
  this.players[id].remove();
  delete(this.players[id]);
};

Game.prototype.addTower = function (id, lat, lng, siteTower) {
  var tower = new Tower(this.map, id, lat, lng);

  if (siteTower) {
    tower.build(siteTower);
  }
  this.towers[id] = tower;
  return tower;
};

Game.prototype.updateTower = function (updatedTurretSite) {
  var actualTower = _.find(this.towers, function (currentTower) {
    return (currentTower.lat == updatedTurretSite[0].position.lat && currentTower.lng == updatedTurretSite[0].position.lon);
  });

  if (!actualTower) {
    return;
  }

  actualTower.updateStatus(updatedTurretSite[0].tower);
};

Game.prototype.addCreep = function (id, lat, lng, hp) {
  var creep = new Creep(this.map, id, lat, lng, hp);
  this.creeps[id] = creep;
  return creep;
};

Game.prototype.removeCreep = function (id) {
  this.creeps[id].remove();
  delete(this.creeps[id]);
};

Game.prototype.showCircles = function (show) {
  _.each(this.towers, function (tower) {
    tower.showCircle(show);
  });
};

Game.prototype.fire = function (latTower, lngTower, latCreep, lngCreep) {
  var id = 'bullet-' + (++this.bulletCounter);
  var bullet = new Bullet(this.map, id, latTower, lngTower, latCreep, lngCreep);
  this.bullets[id] = bullet;
};