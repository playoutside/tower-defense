'use strict';

var util = require('util');

var GameObjectPrototype = require('./GameObjectPrototype.js');

var Creeps = function Creeps () {

  Creeps.super_.apply(this, arguments);

  var that = this;

  var startTime = new Date().valueOf();
  var waveStatus = {
    running: false,
    healthPoints: 0
  };

  this.eventListeners = {
    test: function onCreepsTest (data, socket, done) {
      console.log('message "test" received by creeps: ' + data);
      done();
    }
  };

  this.loopActions = {
    creepsLoopAction: function creepsLoopAction (done) {
      if (!that.gameEngine || !that.gameEngine.level) {
        return done();
      }

      var curGameTime = new Date().valueOf() - startTime;
      var intervalTimeStamp = curGameTime % (that.gameEngine.level.wave.delay + that.gameEngine.level.wave.duration);
      /**
       *
       "wave":{"duration":15,"delay":5,"creepCount":20},
       "creep":{"hitPoints":100,"increment":5},
       */
      if (intervalTimeStamp >= that.gameEngine.level.wave.delay) {
        // now we are in a wave ...
        if (! waveStatus.running) {
          waveStatus.running = true;
          console.log('now we are in a wave');
        }
      } else {
        // now we are between 2 waves ...
        if (waveStatus.running) {
          waveStatus.running = false;
          console.log('now we are between 2 waves');
        }
      }

      done();
    }
  };

};

util.inherits(Creeps, GameObjectPrototype);

module.exports = Creeps;