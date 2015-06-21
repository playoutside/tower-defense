
/**
 * GET /game
 * Running game.
 */
exports.index = function(req, res) {

  res.render('game', {
    title: 'Playing now  "'+global.gameEngine.level.name+'"'
  });

};

