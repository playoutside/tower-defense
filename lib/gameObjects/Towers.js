'use strict';

var util = require('util');

var GameObjectPrototype = require('./GameObjectPrototype.js');

var Towers = function Towers (gameEngine) {

  Towers.super_.apply(this, arguments);

  // ToDo: prefill towers from gameEngine.level.turretSites

  this.eventListeners = {
    test: function onTowersTest (data, socket, done) {
      console.log('message "test" received by towers: ' + data);
      done();
    }
  };

};

util.inherits(Towers, GameObjectPrototype);

module.exports = Towers;