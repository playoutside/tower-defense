'use strict';

function Player(map, id, name, image) {
  this.id = id;
  this.marker = new google.maps.Marker({
    map: map,
    title: name,
    icon: {
      url: image,
      size: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0)
    }
  });
}

Player.prototype.move = function(lat, lng) {
  this.marker.setPosition(new google.maps.LatLng(lat, lng));
};