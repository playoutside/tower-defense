'use strict';

function Tower(map, id, lat, lng) {
  var that = this;

  this.id = id;
  this.lat = lat;
  this.lng = lng;
  this.tower = {
    level: 0,
    id: null
  };
  this.marker = new MarkerWithLabel({
    draggable: false,
    map: map,
    labelContent: '---',
    labelAnchor: new google.maps.Point(20, 40),
    labelClass: "labels", // the CSS class for the label
    labelStyle: {opacity: 0.75},
    icon: {
      url: '/img/tower-empty.png',
      size: new google.maps.Size(128, 128),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(24, 24),
      scaledSize: new google.maps.Size(48, 48)
    }
  });
  this.marker.setPosition(new google.maps.LatLng(lat, lng));

  this.addListener(this);

  this.circle = new google.maps.Circle({
    map: map,
    radius: 30,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });

  this.circle.bindTo('center', this.marker, 'position');
  this.circle.setMap(null);
}

Tower.prototype.isEmpty = function() {
  return this.tower === null;
};

Tower.prototype.build = function(siteTower) {
  if (siteTower) {
    this.tower = {
      id: siteTower.id,
      level: siteTower.level
    };
  }

  this.marker.labelContent = 'L' + this.tower.level;
  this.marker.getIcon().url = '/img/tower.png';
};

Tower.prototype.addListener = function(that) {
  google.maps.event.addListener(this.marker, 'click', function() {
    that.showCircle(!that.isCircleShown());
  });
};

Tower.prototype.upgrade = function() {
  if (!this.isEmpty()) {
    this.tower.level++;
  }
  // TODO: update indicator?
};

Tower.prototype.showCircle = function (flag) {
  if (flag) {
    this.circle.setMap(this.marker.getMap());
  } else {
    this.circle.setMap(null);
  }
};

Tower.prototype.isCircleShown = function () {
  return this.circle.getMap() !== null;
};

Tower.prototype.remove = function() {
  this.marker.setMap(null);
  this.marker = null;
  this.circle.setMap(null);
  this.circle = null;
};

Tower.prototype.updateStatus = function (towerDataSource) {
  this.tower = {
    id: towerDataSource.id,
    level: towerDataSource.level
  };

  console.log(towerDataSource, this.tower);
  //var position = this.marker.getPosition();
  //var map = this.marker.getMap();
  //this.marker.setMap(null);

  this.marker.labelContent = 'L' + this.tower.level;
  this.marker.getIcon().url = (this.tower.level > 0 ? '/img/tower.png' : '/img/tower-empty.png')
  // dirty hack to refresh the marker label - DON'T YOU DARE TO REMOVE THIS LINE
  this.marker.setMap(this.marker.getMap());
};