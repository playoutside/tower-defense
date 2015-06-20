'use strict';

function Creep(map, id, lat, lon) {
  this.id = id;
  this.marker = null; // TODO: create Marker
}

Creep.prototype.kill = function() {
  this.marker.setMap(null);
  this.marker = null;
};