'use strict';

var util = require('util');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Players = function Players () {

  Players.super_.apply(this, arguments);

  this.eventListeners.test = function creepsOnTest (msg) {

    console.log('message "test" received by players: ' + msg);
  };

};

util.inherits(Players, GameObjectPrototype);

module.exports = Players;