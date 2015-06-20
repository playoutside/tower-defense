'use strict';

var gameEngine = require('../lib/gameEngine');

exports.test = function(req, res) {

  try {
    if (req.query.start) {
      gameEngine.run();
    } else if (req.query.stop) {
      gameEngine.stop();
    }
  } catch (err) {
    res.send('ERROR: ' + err.message);
    return;
  }

  res.send(JSON.stringify('OK', null, 2));

};