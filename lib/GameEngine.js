'use strict';

var FRAMES_PER_SECOND = 25;

var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var gameLoop = require('node-gameloop');

var GameObjectPrototype = require('./gameObjects/GameObjectPrototype.js');

var GameEngine = function GameEngine (_level) {

  var that = this;

  var id = null;
  var loopActions = [];
  var gameObjects = {};

  this.framesPerSecond = FRAMES_PER_SECOND;

  this.io = null;

  this.level = _level;

  this.run = function run (server) {
    if (id !== null) {
      throw new Error('Engine already running!');
    }

    loadFromSubDir('gameObjects', registerGameObject);

    this.io = require('socket.io')(server);
    this.io.on('connection', function(socket) {
      console.log('GameEngine: socket connected!', socket.id);

      socket.on('error' , function onError (err) {
        console.log('GameEngine: socket error on ', socket.id, ': ', err);
      });

      _.each(gameObjects, function eachGameObjects (gameObject, gameObjectName) {
        _.each(gameObject.eventListeners, function eachEventListeners (eventListener, eventListenerName) {
          if (eventListenerName === 'connect') {
            eventListener(socket);
          } else if (eventListenerName === 'disconnect') {
            socket.on('disconnect' , function onDisconnectWrapper () {
              eventListener.call(this, socket);
            });
          } else {
            socket.on(gameObjectName + '.' + eventListenerName, function onEventWrapper (data) {
              //console.log('message "' + gameObjectName + '.' + eventListenerName + '" received by gameEngine: ', data);
              eventListener.call(this, data, socket, function eventListenerDone (err) {
                // ToDo: Error handling
              });
            });
          }
        });
      });

      socket.on('disconnect' , function onDisconnect () {
        console.log('GameEngine: socket disconnected!!!', socket.id);
      });
    });

    var runLoopAction = function runLoopAction (loopAction) {
      if (!loopAction.running) {
        loopAction.running = true;
        loopAction.fn(function loopActionDone (err) {
          loopAction.running = false;
        });
      }
    };

    id = gameLoop.setGameLoop(function(delta) {
      for (var i = 0; i < loopActions.length; i++) {
        runLoopAction (loopActions[i]);
      }
    }, 1000 / this.framesPerSecond);
  };

  this.stop = function stop () {
    if (id === null) {
      throw new Error('Engine not running!');
    }

    gameLoop.clearGameLoop(id);
    id = null;
  };

  this.sendFullStatus = function sendFullStatus (socket) {
    var fullStatus = {};

    _.each(gameObjects, function eachGameObjects (gameObject, gameObjectName) {
      fullStatus[gameObjectName] = gameObject.getStatus();
    });

    fullStatus.level = that.level;

    //console.log('fullStatus: ', fullStatus);
    socket.emit('Game.fullStatus', fullStatus);
  };

  var proximityManager = function proximityManager (objectType, entity) {

    if (objectType === 'Players') {
      var actions = [];
      var action = '';
      var cost = 0;
      _level.turretSites.forEach(function turretSitesForEach (site) {
        if (_level.getProximity(entity.pos, site.position) < 25) {
          action = site.tower ? 'Towers.upgrade' : 'Towers.build';
          cost = site.tower ? _level.tower.cost + _level.tower.costIncrement * site.tower.level : _level.tower.cost;

          actions.push({
            action: action,
            cost: cost,
            position: site.position
          });
        }
      });

      entity.socket.emit('Player.actionAvailable', actions);

    } else if (objectType === 'Creeps') {
      _level.turretSites.forEach(function turretSitesForEach (site) {
        if (!site.tower) {
          return; // skip sites without a tower
        }

        var creepsVisible = [];

        for (var i = 0; i < entity.length; i++) {
          if (_level.getProximity(entity[i].pos, site.position) < 25) {
            creepsVisible.push(entity[i]);
          }
        }

        site.tower.canSee(creepsVisible);
      });
    }

  };

  var registerGameObject = function registerGameObject (_name, _obj) {
    if (!_obj instanceof GameObjectPrototype) {
      throw new Error('Invalid game object supplied!');
    }

    gameObjects[_name] = new _obj(that);
    if (gameObjects[_name].canMove) {
      gameObjects[_name].eventEmiters.onMove = function eventEmiterOnMove (entity) {
        proximityManager(_name, entity);
      };
    }

    _.each(gameObjects[_name].loopActions, function eachGameObjects (loopAction, loopActionName) {
      loopActions.push({
        name: _name + '.' + loopActionName,
        fn: loopAction,
        running: false
      });
    });

  };

  var loadFromSubDir = function loadFromSubDir(_subDirName, _registerFunction) {
    async.each(fs.readdirSync(path.join(__dirname, _subDirName)), function loadFile (file) {
      if (!file.match(/^[a-zA-Z0-9]+\.js$/)) {
        // skip all non js files
        return;
      }

      var container = require(path.join(__dirname, _subDirName + '/' + file));
      _registerFunction(file.substr(0, file.length - 3), container);
    });
  };

};

module.exports = GameEngine;