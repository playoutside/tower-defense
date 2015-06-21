'use strict';

var GameObjectPrototype = function GameObjectPrototype () {

  this.gameEngine = null;

  this.eventListeners = {};

  this.loopActions = {};

  this.getStatus = function getStatus () {
    return {};
  };

};

module.exports = GameObjectPrototype;