'use strict';

function Tower(map, id, lat, lng) {
  this.id = id;
  this.tower = null;
  this.marker = new google.maps.Marker({
    map: map,
    icon: {
      url: '/img/tower-empty.png',
      size: new google.maps.Size(128, 128),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(24, 24),
      scaledSize: new google.maps.Size(48, 48)
    }
  });
  this.marker.setPosition(new google.maps.LatLng(lat, lng));
}

Tower.prototype.isEmpty = function() {
  return this.tower === null;
};

Tower.prototype.build = function() {
  var position = this.marker.getPosition();
  this.marker.setMap(null);
  this.marker = new google.maps.Marker({
    map: map,
    icon: {
      url: '/img/tower.png',
      size: new google.maps.Size(128, 128),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(24, 24),
      scaledSize: new google.maps.Size(48, 48)
    }
  });
  this.marker.setPosition(position);


  this.tower = {
    level: 1
  };
};

Tower.prototype.upgrade = function() {
  if (!this.isEmpty()) {
    this.tower.level++
  }
  // TODO: update indicator?
};
