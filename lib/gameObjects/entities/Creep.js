'use strict';

var Creep = function Creep () {

  this.name = "";

  this.hitPoints = {
    current:0,
    max:0
  };

  this.lifeTime = 0;

  this.pos = {
    lat: null,
    lon: null,
    lastUpdate: null
  };

    /**
     * Creep moves a fraction of the distance between previous and pathIndex towards next point on path with each tick
     *
     * @type {number}
     */
    this.pathIndex = 0;



    this.move = function() {

    }

};




module.exports = Creep;