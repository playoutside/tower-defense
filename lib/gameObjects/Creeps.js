'use strict';

var _ = require('underscore');
var util = require('util');

var GameObjectPrototype = require('./GameObjectPrototype.js');
var Creep = require('./entities/Creep.js');

var Creeps = function Creeps (gameEngine) {

  Creeps.super_.apply(this, arguments);

  this.canMove = true;

  var that = this;

  var activeCreeps = [];
  var lastCreepId = 0;
  var hitPoints = gameEngine.level.creep.hitPoints;
  var creepStartPos = gameEngine.level.path[0];
  var spawnCreepChance = gameEngine.level.wave.creepCount / (gameEngine.framesPerSecond * gameEngine.level.wave.duration);

  var startTime = new Date().valueOf();
  var waveStatus = {
    running: false,
    startTime: null,
    spawnedCreeps: 0
  };

  this.eventListeners = {
    test: function onCreepsTest (data, socket, done) {
      console.log('message "test" received by creeps: ' + data);
      done();
    }
  };

  var spawnCreep = function spawnCreep (now) {
    var newCreep = new Creep();
    newCreep.id = ++lastCreepId;
    newCreep.socket = now;
    newCreep.creationTime = now;
    newCreep.pos = creepStartPos;
    newCreep.pos.lastUpdate = now;
    newCreep.hitPoints = hitPoints;
    newCreep.speed = (Math.random() * gameEngine.level.creep.speed.max) + gameEngine.level.creep.speed.min;
    newCreep.hit = function hit (damage) {
      //console.log('Hitting creep [' + newCreep.id + '] for [' + damage + '] damage, had [' + newCreep.hitPoints + '] HP');
      newCreep.hitPoints -= damage;
    };
    activeCreeps.push(newCreep);
  };

  this.loopActions = {
    spawn: function spawnCreeps (done) {
      var now = new Date().valueOf();
      var curGameTime = now - startTime;
      var intervalTimeStamp = curGameTime % (gameEngine.level.wave.delay * 1000 + gameEngine.level.wave.duration * 1000);
      var i, statusChanges = false;

      if (intervalTimeStamp >= gameEngine.level.wave.delay * 1000) {
        // now we are in a wave ...
        if (! waveStatus.running) {
          waveStatus.running = true;
          waveStatus.startTime = now;
          waveStatus.spawnedCreeps = 0;
          console.log('Wave', gameEngine.wave, 'GameTime', curGameTime);
          gameEngine.io.emit('Creeps.newWave', {
            wave: gameEngine.wave
          });
          gameEngine.wave++;
        }
        var elapsedWaveTime = now - waveStatus.startTime;
        var spawnCreepMax = (elapsedWaveTime / (gameEngine.level.wave.duration * 1000) * gameEngine.level.wave.creepCount)  - waveStatus.spawnedCreeps;
        for (i = 0; i < spawnCreepMax; i++) {
          if (Math.random() < spawnCreepChance) {
            spawnCreep(now);
            waveStatus.spawnedCreeps++;
            statusChanges = true;
          }
        }
      } else {
        // now we are in delay between waves ...
        if (waveStatus.running) {
          waveStatus.running = false;
          for (i = 0; i < gameEngine.level.wave.creepCount - waveStatus.spawnedCreeps; i++) {
            spawnCreep(now);
            waveStatus.spawnedCreeps++;
            statusChanges = true;
          }
          hitPoints += gameEngine.level.creep.increment;
          console.log('now we are in a delay between waves', curGameTime);
        }
      }

      if (statusChanges) {
        gameEngine.io.emit('Creeps.status', that.getStatus());
      }

      done();
    },

    move: function moveCreeps(done) {
      if (!activeCreeps.length) {
        return done();
      }

      var now = new Date().valueOf();
      var creepsToRemove = [];
      _.each(activeCreeps, function eachActiveCreeps (activeCreep, key) {
        var lifeTime = (now - activeCreep.creationTime) / 1000;
        var distanceToMove = activeCreep.speed * lifeTime;
        if (distanceToMove >= gameEngine.level.pathMetrics.length) {
          creepsToRemove.push(key);
          gameEngine.health--;
          gameEngine.io.emit('Players.health', gameEngine.health);
          if (gameEngine.health <= 0) {
            gameEngine.io.emit('Game.over');
            gameEngine.stop();
          }
        } else {
          activeCreep.pos = gameEngine.level.getPosition(distanceToMove);
          activeCreep.pos.lastUpdate = now;
        }
        if (activeCreep.hitPoints <= 0) {
          creepsToRemove.push(key);
          gameEngine.credits += 1;
          gameEngine.io.emit('Players.credits', gameEngine.credits);
        }
      });

      if (creepsToRemove.length) {
        var removeMsg = [];
        creepsToRemove.forEach(function creepsToRemoveForEach (item) {
          removeMsg.push({id: activeCreeps[item].id});
          activeCreeps.splice(item, 1);
        });
        gameEngine.io.emit('Creeps.remove', removeMsg);
      }

      if (!activeCreeps.length) {
        return done();
      }

      gameEngine.io.emit('Creeps.status', that.getStatus());

      that.eventEmiters.onMove(activeCreeps);

      done();
    }
  };

  this.getStatus = function getStatus () {
    var status = [];
    _.each(activeCreeps, function eachActiveCreeps (activeCreep) {
      var creepInfo = _.omit(activeCreep, 'socket');
      status.push(creepInfo);
    });
    //console.log(status[0],status[status.length -1]);
    return status;
  };

};

util.inherits(Creeps, GameObjectPrototype);

module.exports = Creeps;