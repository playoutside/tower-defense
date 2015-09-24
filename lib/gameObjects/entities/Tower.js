'use strict';

var Tower = function Tower () {

  this.id = null;

  this.damage = 0;

  this.range = 0;

  /* delay in milliseconds */
  this.cooldownDelay = 1000;

  this.level = 1;

  this.visibleCreeps = [];

  this.canSee = function canSee(creeps) {
    this.visibleCreeps = creeps;
  };
};

module.exports = Tower;