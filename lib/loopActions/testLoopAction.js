'use strict';

var runCounter = 0;

module.exports = function testLoopAction (done) {
  var duration = 750 + (Math.random()) * 2000;
  runCounter++;
  console.log('testLoopAction (run ' + runCounter + ') start - running for ' + duration);
  setTimeout(function () {
    console.log('testLoopAction (run ' + runCounter + ') done ');
    done();
  }, duration);
};