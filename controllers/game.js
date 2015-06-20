var Level = require('../models/Level');
var Game = require('../models/Game');

/**
 * GET /game
 * Running game.
 */
exports.index = function(req, res) {

    Game.findOne({status:'active'}).lean().exec(

        function(err,currentGame) {



            if (err) {
                throw err;
            }

            if ( !currentGame ) {
                console.log('No active game found. Spawning new game.');

                //todo: Return a list of available levels OR option to create a map
                //for now... select the first level available and use it

                Level.findOne("{}").lean().exec( function(err,level){

                    if (err) {
                        throw err;
                    }

                    if (!level) {
                        throw new Error('No levels ');
                    }

                    console.log('Loading default level done...',level);

                    global.gameEngine.level = level;

                    global.gameEngine.game = new Game();
                    global.gameEngine.game.levelId = level._id;
                    global.gameEngine.game.save();

                    res.render('game', {
                        title: 'New Game "'+level.name+'"'
                    });


                });


            } else {

                console.log('Active game found');

                //use loaded game object
                global.gameEngine.game = currentGame;

                Level.findOne({_id:currentGame.levelId}).lean().exec(function(err,level){

                    if (err) {
                        throw err;
                    }

                    if (!level) {
                        throw new Error('No levels ');
                    }

                    global.gameEngine.level = level;

                    res.render('game', {
                        title: 'Playing now  "'+level.name+'"'
                    });

                });




            }


        }
    );




};

