'use strict';

var util = require('util');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Creeps = function Creeps () {

  Creeps.super_.apply(this, arguments);

  this.eventListeners.test = function onCreepsTest (data) {

    console.log('message "test" received by creeps: ' + data);
  };

};

util.inherits(Creeps, GameObjectPrototype);

module.exports = Creeps;