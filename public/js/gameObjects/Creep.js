'use strict';

function Creep(map, id, lat, lng) {
  this.id = id;
  this.marker = new google.maps.Marker({
    map: map,
    icon: {
      url: 'https://gravatar.com/avatar/' + id + '?s=48&d=monsterid',
      size: new google.maps.Size(48, 48),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12),
      scaledSize: new google.maps.Size(24, 24)
    }
  });
  this.marker.setPosition(new google.maps.LatLng(lat, lng));
}

Creep.prototype.move = function(lat, lng) {
  this.marker.setPosition(new google.maps.LatLng(lat, lng));
};

Creep.prototype.remove = function() {
  this.marker.setMap(null);
  this.marker = null;
};