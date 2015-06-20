'use strict';

var FRAMES_PER_SECOND = 1;

var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var gameLoop = require('node-gameloop');

var GameObjectPrototype = require('./GameObjectPrototype.js');


var GameEngine = function GameEngine () {

  var id = null;
  var loopActions = [];
  var gameObjects = {};
  var gameObjectsEventListener = {};

  this.run = function run (socket) {
    if (id !== null) {
      throw new Error('Engine already running!');
    }

    if (socket && socket.on) {
      socket.on('clientEvent', function onClientEvent (msg) {
        gameObjectsEventListener[msg.target + '.' + msg.type].call(this, msg);
        console.log('message received by gameEngine: ' + msg);
      });
    }

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
    }, 1000 / FRAMES_PER_SECOND);
  };

  this.stop = function stop () {
    if (id === null) {
      throw new Error('Engine not running!');
    }

    gameLoop.clearGameLoop(id);
    id = null;
  };

  var registerLoopAction = function registerLoopAction (_name, _fn) {
    if (typeof _fn !== 'function') {
      throw new Error('Invalid function supplied!');
    }

    loopActions.push({
      name: _name,
      fn: _fn,
      running: false
    });
  };

  var registerGameObject = function registerGameObject (_name, _obj) {
    if (!_obj instanceof GameObjectPrototype) {
      throw new Error('Invalid game object supplied!');
    }

    var gameObject = new _obj();

    gameObjects[_name] = gameObject;

    _.each(gameObject.eventListeners, function eachEventListeners (val, key) {
      gameObjectsEventListener[_name + '.' + key] = val;
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

  loadFromSubDir('loopActions', registerLoopAction);
  loadFromSubDir('gameObjects', registerGameObject);

};

module.exports = new GameEngine();