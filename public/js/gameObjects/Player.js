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
      anchor: new google.maps.Point(16, 16)
    }
  });


  google.maps.event.addListener(this.marker, 'click', function() {

    var circle = new google.maps.Circle({
      map: map,
      radius: 30,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });

    circle.bindTo('center', this, 'position');
    /*circle.setMap(null);*/

   });

}

Player.prototype.move = function(lat, lng) {
  this.marker.setPosition(new google.maps.LatLng(lat, lng));
};