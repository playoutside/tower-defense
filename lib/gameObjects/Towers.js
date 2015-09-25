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


  this.build = function build (siteLocation) {

    console.log('locations: ');
    console.log(siteLocation);
    console.log(gameEngine.level.turretSites);

    var site = _.find(gameEngine.level.turretSites, function(site) {
      console.log('in find: ');
      console.log(site);
      console.log((siteLocation.lat === site.position.lat && siteLocation.lon === site.position.lon));


      return (siteLocation.lat === site.position.lat && siteLocation.lon === site.position.lon) ? true : false;
    });

    console.log(site);
    if (!site) return false;

    var tower = new Tower;
    tower.damage = gameEngine.level.tower.damage;
    tower.range = gameEngine.level.tower.range;
    activeTowers.push(tower);

    console.log(tower);

    return tower;
  }

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
            activeTower.visibleCreeps[0].hit(activeTower.damage + damageIncrement * (activeTower.level -1));
          }
        }
      });

      done();
    },

  };

  this.build({lat: '50.409846', lon: '9.622218'});

};

util.inherits(Towers, GameObjectPrototype);

module.exports = Towers;