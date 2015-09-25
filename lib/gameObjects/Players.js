'use strict';

var util = require('util');
var _ = require('underscore');

var User = require('../../models/User.js');

var GameObjectPrototype = require('./GameObjectPrototype.js');

var Players = function Players (gameEngine) {

  Players.super_.apply(this, arguments);

  this.canMove = true;

  var that = this;

  var activePlayers = {};

  this.eventListeners = {
    disconnect: function onPlayersDisconnect (socket) {
      if (activePlayers[socket.id]) {
        console.log('Player with ID "' + activePlayers[socket.id].playerId + '" on socket "' + socket.id + '" left the game');
        socket.broadcast.emit('Players.disconnect', {playerId: activePlayers[socket.id].playerId});
        delete activePlayers[socket.id];

        return true;
      }

      return false;
    },

    join: function onPlayersJoin (data, socket, done) {
      User.findOne({_id: data.playerId}).exec(function findOneCallback (err, user) {
        if (err) {
          console.log('Error querying Player with ID "' + data.playerId + '": ' + err.message);
          done(err);
        }

        if (!user) {
          console.log('Player with ID "' + data.playerId + '" not fond!');
          done(new Error('Player not fond!'));
        }

        console.log('Player "' + user.profile.name + '" with ID "' + data.playerId + '" joined on socket "' + socket.id + '"');
        var userData = {
          name: user.profile.name,
          image: user.gravatar(32)
        };

        activePlayers[socket.id] = {
          playerId: data.playerId,
          socket: socket,
          pos: {
            lat: null,
            lon: null,
            lastUpdate: null
          },
          user: userData
        };

        socket.broadcast.emit(
          'Players.join',{
            playerId: data.playerId,
            name: userData.name,
            image: userData.image
          }
        );

        gameEngine.sendFullStatus(socket);

        done();
      });
    },

    move: function onPlayersMove (data, socket, done) {
      //console.log('message "move" received by players: ', data);

      if (activePlayers[socket.id]) {

        if (data.playerId === activePlayers[socket.id].playerId) {

          activePlayers[socket.id].pos = {
            lat: data.latitude,
            lon: data.longitude,
            lastUpdate: new Date()
          };

          socket.broadcast.emit('Players.pos', data);

          that.eventEmiters.onMove(activePlayers[socket.id]);

          done();

        } else {

          console.log('received invalid message "move": payerId mismatch -> ' + data.playerId + ' != ' + activePlayers[socket.id].playerId);
          delete activePlayers[socket.id];

          done(new Error('payerId mismatch'));
        }
      }
    }
  };

  this.getStatus = function getStatus () {
    var status = [];
    _.each(activePlayers, function eachActivePlayers (activePlayer) {
      var playerInfo = _.omit(activePlayer, 'socket');
      playerInfo = _.omit(playerInfo, 'user');
      playerInfo.name = activePlayer.user.name;
      playerInfo.image = activePlayer.user.image;
      playerInfo.pos = activePlayer.pos;
      status.push(playerInfo);
    });

    return status;
  };
};

util.inherits(Players, GameObjectPrototype);

module.exports = Players;