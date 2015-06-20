/**
 * GET /game
 * Running game.
 */
exports.index = function(req, res) {
  res.render('game', {
    title: 'Default Game'
  });
};