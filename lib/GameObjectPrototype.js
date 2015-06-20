'use strict';

var GameObjectPrototype = function GameObjectPrototype () {

  this.eventListeners = {};

  this.loopActions = {};

  this.getStatus = function getStatus () {
    return {};
  };

};

module.exports = GameObjectPrototype;