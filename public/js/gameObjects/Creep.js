'use strict';

function Creep(map, id, lat, lon) {
  this.id = id;
  this.marker = null; // TODO: create Marker
}

Creep.prototype.remove = function() {
  this.marker.setMap(null);
  this.marker = null;
};