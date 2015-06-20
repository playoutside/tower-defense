'use strict';

var util = require('util');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Creeps = function Creeps () {

  Creeps.super_.apply(this, arguments);

  this.eventListeners.test = function creepsOnTest (msg) {

    console.log('message "test" received by creeps: ' + msg);
  };

};

util.inherits(Creeps, GameObjectPrototype);

module.exports = Creeps;