'use strict';

function Creep(map, id, lat, lng, hp) {
  this.id = id;
  this.maxHP = 100; // this needs to be adjusted with each wave
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

  this.healthBar = new google.maps.Marker({
    map: map,
    icon: {
      url: 'https://gravatar.com/avatar/' + id + '?s=48&d=monsterid',
      size: new google.maps.Size(48, 48),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 18),
      scaledSize: new google.maps.Size(24 * hp / this.maxHP, 5)
    }
  })
}

Creep.prototype.move = function(lat, lng, hp) {
  this.marker.setPosition(new google.maps.LatLng(lat, lng));
  this.marker.setTitle('Hitpoints: ' + hp);

  this.healthBar.setPosition(new google.maps.LatLng(lat, lng));
  this.healthBar.setIcon({
      url: '/img/health.png',
      size: new google.maps.Size(48, 48),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 18),
      scaledSize: new google.maps.Size(24 * hp / this.maxHP, 5)
    });

};

Creep.prototype.remove = function() {
  this.marker.setMap(null);
  this.marker = null;
  this.healthBar.setMap(null);
  this.healthBar = null;
};