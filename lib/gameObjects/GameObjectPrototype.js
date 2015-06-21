'use strict';

var GameObjectPrototype = function GameObjectPrototype (gameEngine) {

  if (!gameEngine || !gameEngine.level) {
    throw new Error('No level definition supplied!');
  }

  this.eventListeners = {};

  this.loopActions = {};

  this.getStatus = function getStatus () {
    return {};
  };

};

module.exports = GameObjectPrototype;