'use strict';

var FRAMES_PER_SECOND = 2;

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

  this.level = _level;

  this.io = null;

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
          } else if (eventListenerName === 'connect' || eventListenerName === 'disconnect') {
            socket.on('disconnect' , function onDisconnectWrapper () {
              eventListener.call(this, socket);
            });
          } else {
            socket.on(gameObjectName + '.' + eventListenerName, function onEventWrapper (data) {
              //console.log('message "' + gameObjectName + '.' + eventListenerName + '" received by gameEngine: ', data);
              eventListener.call(this, data, socket, function eventListenerDone (err) {
                if (!err && gameObjectName === 'Players' && eventListenerName === 'join') {
                  var fullStatus = {};

                  _.each(gameObjects, function eachGameObjects (gameObject, gameObjectName) {
                    fullStatus[gameObjectName] = gameObject.getStatus();
                  });

                  fullStatus.level = that.level;

                  //console.log('fullStatus: ', fullStatus);
                  socket.emit('Game.fullStatus', fullStatus);
                }
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

  var registerGameObject = function registerGameObject (_name, _obj) {
    if (!_obj instanceof GameObjectPrototype) {
      throw new Error('Invalid game object supplied!');
    }

    gameObjects[_name] = new _obj(that);

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