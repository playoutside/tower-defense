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
  var damage = gameEngine.level.tower.damage + 40;


  this.build = function build (siteLocation) {

    var site = _.find(gameEngine.level.turretSites, function(site) {
      return (siteLocation.lat == site.position.lat && siteLocation.lon == site.position.lon) ? true : false;
    });

    if (!site) return false;

    var tower = new Tower;
    tower.id = ++lastTowerId;
    tower.damage = gameEngine.level.tower.damage;
    tower.range = gameEngine.level.tower.range;
    activeTowers.push(tower);

    site.tower = tower;

    return tower;
  }

  this.eventListeners = {
    test: function onTowersTest (data, socket, done) {
      console.log('message "test" received by towers: ' + data);
      done();
    },
    build: function onTowersBuild (data, socket, done) {
      var tower = that.build(data);
      data.level = tower.level;

      gameEngine.io.emit('Tower.build', data);
      done();
    }
  };

  this.loopActions = {
    fire: function fire (done) {
      _.each(activeTowers, function(activeTower, key) {
        if (activeTower.lastFireTime + activeTower.cooldown < Date.now()) {
          if (activeTower.visibleCreeps.length > 0) {
            activeTower.visibleCreeps[0].hit(activeTower.damage + damageIncrement * (activeTower.level -1));
            activeTower.lastFireTime = Date.now();
          }
        }
      });

      done();
    },

  };

};

util.inherits(Towers, GameObjectPrototype);

module.exports = Towers;