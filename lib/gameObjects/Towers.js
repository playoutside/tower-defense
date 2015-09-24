'use strict';

var util = require('util');

var GameObjectPrototype = require('./GameObjectPrototype.js');
var Tower = require('./entities/Tower.js');

var Towers = function Towers (gameEngine) {

  Towers.super_.apply(this, arguments);

  // ToDo: prefill towers from gameEngine.level.turretSites
  var that = this;

  var activeTowers = [];
  var lastTowerId = 0;
  var increment = gameEngine.level.tower.increment;
  var damage = gameEngine.level.tower.damage;

  this.eventListeners = {
    test: function onTowersTest (data, socket, done) {
      console.log('message "test" received by towers: ' + data);
      done();
    },
  };

  this.loopActions = {
    fire: function fire (done) {
      // todo: check cooldown
    },

  };

};

util.inherits(Towers, GameObjectPrototype);

module.exports = Towers;