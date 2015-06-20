'use strict';

var runCounter = 0;

module.exports = function testLoopAction (done) {
  var duration = 750 + (Math.random()) * 2000;
  runCounter++;
  setTimeout(function () {
    done();
  }, duration);
};