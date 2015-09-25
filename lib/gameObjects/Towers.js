'use strict';

var _ = require('underscore');
var util = require('util');

var GameObjectPrototype = require('./GameObjectPrototype.js');
var Tower = require('./entities/Tower.js');

var Towers = function Towers (gameEngine) {

  Towers.super_.apply(this, arguments);

  var that = this;

  var activeTowers = [];
  var activeTurretSites = [];
  var lastTowerId = 0;

  var damageIncrement = gameEngine.level.tower.damageIncrement;
  var damage = gameEngine.level.tower.damage;
  var cooldownDecrement = gameEngine.level.tower.cooldownDecrement;
  var minCooldown = 500;

  this.build = function build (siteLocation) {

    var site = _.find(gameEngine.level.turretSites, function(site) {
      return (siteLocation.lat == site.position.lat && siteLocation.lon == site.position.lon) ? true : false;
    });

    if (!site) return false;

    var tower = new Tower;
    tower.id = ++lastTowerId;
    tower.damage = damage;
    tower.range = gameEngine.level.tower.range;
    tower.cooldown = gameEngine.level.tower.cooldown;

    var foundTurretSite = false;
    _.each(activeTurretSites, function (turretSite) {
      if (!turretSite) return;

      if (turretSite.position.lat === site.position.lat
        && turretSite.position.lon === site.position.lon) {

        foundTurretSite = true;
      }
    });

    if (foundTurretSite) {
      return false;
    }

    activeTowers.push(tower);
    activeTurretSites[tower.id] = site;

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
      data.id = tower.id;

      gameEngine.io.emit('Tower.build', data);
      done();
    },
    upgrade: function onTowersUpgrade (data, socket, done) {
      var tower = _.find(activeTowers, function (tower) {
        return tower.id === data.id;
      });

      if (!tower)
        return;

      tower.level++;

      done();
    }
  };

  this.loopActions = {
    fire: function fire (done) {
      _.each(activeTowers, function(activeTower, key) {
        var actualCooldown = (activeTower.cooldown - cooldownDecrement * (activeTower.level -1)) >= minCooldown
          ? (activeTower.cooldown - cooldownDecrement * (activeTower.level -1))
          : activeTower.cooldown;


        if (activeTower.lastFireTime + actualCooldown < Date.now()) {
          if (activeTower.visibleCreeps.length > 0) {
            activeTower.visibleCreeps[0].hit(activeTower.damage + damageIncrement * (activeTower.level -1));
            activeTower.lastFireTime = Date.now();
            gameEngine.io.emit('Tower.fire', {
              turret: activeTurretSites[activeTower.id].position,
              creep: activeTower.visibleCreeps[0].pos
            });
          }
        }
      });

      done();
    },

  };

  this.getStatus = function getStatus () {
    var status = [];
    _.each(activeTowers, function eachActiveTowers (activeTower) {
      var towerInfo = _.omit(activeTower, 'socket');
      status.push(activeTower);
    });

    return status;
  };

};

util.inherits(Towers, GameObjectPrototype);

module.exports = Towers;