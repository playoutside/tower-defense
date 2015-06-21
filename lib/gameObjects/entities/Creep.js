'use strict';

var Creep = function Creep () {

  this.id = null;

  this.hitPoints = 0;

  this.creationTime = 0;

  this.speed = 1;

  this.pos = {
    lat: null,
    lon: null,
    lastUpdate: null
  };

};

module.exports = Creep;