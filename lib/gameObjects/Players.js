'use strict';

var util = require('util');
var User = require('../../models/User.js');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Players = function Players () {

  Players.super_.apply(this, arguments);

  var activePlayers = {};

  this.eventListeners.disconnect = function onPlayersDisconnect (socket) {
    if (activePlayers[socket.id]) {
      console.log('Player with ID "' + activePlayers[socket.id].playerId + '" on socket "' + socket.id + '" left the game');
      socket.broadcast.emit('Players.disconnect', {playerId: activePlayers[socket.id].playerId});
      delete activePlayers[socket.id];
    }
  };

  this.eventListeners.join = function onPlayersJoin (data, socket) {
    User.findOne({_id: data.playerId}).lean().exec(function findOneCallback (err, user) {
      if (err) {
        console.log('Error querying Player with ID "' + data.playerId + '": ' + err.message);
        return;
      }

      if (!user) {
        console.log('Player with ID "' + data.playerId + '" not fond!');
        return;
      }

      console.log('Player "' + user.profile.name + '" with ID "' + data.playerId + '" joined on socket "' + socket.id + '"');

      activePlayers[socket.id] = {
        playerId: data.playerId,
        socket: socket,
        pos: {
          lat: null,
          lon: null,
          lastUpdate: null
        }
      };

      socket.broadcast.emit('Players.join', {playerId: data.playerId, profile: user.profile});
    });
  };

  this.eventListeners.move = function onPlayersMove (data, socket) {
    //console.log('message "move" received by players: ', data);

    if (activePlayers[socket.id]) {
      if (data.playerId === activePlayers[socket.id].playerId) {
        activePlayers[socket.id].pos = {
          lat: data.latitude,
          lon: data.longitude,
          lastUpdate: new Date()
        };

        socket.broadcast.emit('Players.pos', data);
      } else {
        console.log('received invalid message "move": payerId mismatch -> ' + data.playerId + ' != ' + activePlayers[socket.id].playerId);
        delete activePlayers[socket.id];
      }
    }
  };

};

util.inherits(Players, GameObjectPrototype);

module.exports = Players;