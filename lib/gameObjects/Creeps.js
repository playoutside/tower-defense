'use strict';

var util = require('util');

var GameObjectPrototype = require('../GameObjectPrototype.js');

var Creeps = function Creeps () {

  Creeps.super_.apply(this, arguments);

  var runCounter = 0;

  this.eventListeners = {
    test: function onCreepsTest (data, socket, done) {
      console.log('message "test" received by creeps: ' + data);
      done();
    }
  };

  this.loopActions = {
    creepsLoopAction: function creepsLoopAction (done) {
      //console.log('creepsLoopAction');
      done();
    },

    testLoopAction: function testLoopAction (done) {
      var duration = 750 + (Math.random()) * 2000;
      runCounter++;
      //console.log('testLoopAction (run ' + runCounter + ') start - running for ' + duration);
      setTimeout(function () {
        //console.log('testLoopAction (run ' + runCounter + ') done ');
        done();
      }, duration);
    }
  };

};

util.inherits(Creeps, GameObjectPrototype);

module.exports = Creeps;