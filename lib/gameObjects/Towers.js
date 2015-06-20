'use strict';

var util = require('util');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Towers = function Towers () {

  Towers.super_.apply(this, arguments);

  this.eventListeners.test = function onTowersTest (data) {

    console.log('message "test" received by towers: ' + data);
  };

};

util.inherits(Towers, GameObjectPrototype);

module.exports = Towers;