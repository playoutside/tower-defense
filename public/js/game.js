'use strict';

function Game() {
  this.players = [];
  this.currentPlayer = null;
}

Game.prototype.setCurrentPlayer = function (player) {
  this.currentPlayer = player;
  return player;
};

Game.prototype.addPlayer = function (map, id, name, image) {
  var player = new Player(map, id, name, image);
  this.players.push(player);
  return player;
};