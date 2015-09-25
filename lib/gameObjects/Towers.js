'use strict';

var _ = require('underscore');
var util = require('util');

var GameObjectPrototype = require('./GameObjectPrototype.js');
var Tower = require('./entities/Tower.js');

var Towers = function Towers (gameEngine) {

  Towers.super_.apply(this, arguments);

  var that = this;

  var activeTowers = [];
  var lastTowerId = 0;

  var lastFireTime = Date.now();
  var damageIncrement = gameEngine.level.tower.damageIncrement;
  var damage = gameEngine.level.tower.damage;

  this.eventListeners = {
    test: function onTowersTest (data, socket, done) {
      console.log('message "test" received by towers: ' + data);
      done();
    },
  };

  this.loopActions = {
    fire: function fire (done) {
      _.each(activeTowers, function(activeTower, key) {
        if (activeTower.lastFireTime + activeTower.cooldown < Date.now()) {
          if (activeTower.visibleCreeps.length > 0) {
            activeTower.visibleCreeps[0].hit(damage + damageIncrement * (activeTower.level -1));
          }
        }
      });

      done();
    },

  };

};

util.inherits(Towers, GameObjectPrototype);

module.exports = Towers;