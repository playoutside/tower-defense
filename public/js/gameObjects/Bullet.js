'use strict';

function Bullet(map, id, latTower, lngTower, latCreep, lngCreep) {
  this.created = Date.now();
  this.id = id;

  this.shape = new google.maps.Polyline({
    path: [
      {lat: latTower, lng: lngTower},
      {lat: latCreep, lng: lngCreep}
    ],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 15
  });
  this.shape.setMap(map);
}

Bullet.prototype.remove = function() {
  this.shape.setMap(null);
  this.shape = null;
};