'use strict';

var util = require('util');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Players = function Players () {

  Players.super_.apply(this, arguments);

  this.eventListeners.move = function playersMove (msg) {

    console.log('message "move" received by players: ', msg);
  };

};

util.inherits(Players, GameObjectPrototype);

module.exports = Players;