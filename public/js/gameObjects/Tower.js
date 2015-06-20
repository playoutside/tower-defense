'use strict';

function Tower(map, id, name, lat, lon) {
  this.id = id;
  this.tower = null;
  this.marker = null; // TODO: create Marker or drawing
}

Tower.prototype.isEmpty = function() {
  return this.tower === null;
};