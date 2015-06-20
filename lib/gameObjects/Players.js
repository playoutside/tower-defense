'use strict';

var util = require('util');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Players = function Players () {

  Players.super_.apply(this, arguments);

  this.eventListeners.move = function onPlayersMove (data) {

    console.log('message "move" received by players: ', data);
  };

};

util.inherits(Players, GameObjectPrototype);

module.exports = Players;