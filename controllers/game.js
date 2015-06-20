var Level = require('../models/Level');
var Game = require('../models/Game');

/**
 * GET /game
 * Running game.
 */
exports.index = function(req, res) {

    Game.find({status:'active'}).limit(1).execute(

        function(err,data) {

            console.log(err,data);

            if (err) {
                throw err;
            }

            if ( data.length === 0) {
                //todo: Return a list of available levels OR option to create a map
                //for now... select the first level available and use it

                Level.find("{}").limit(10).exec(function(err,data){

                    if (err) {
                        throw err;
                    }

                    if (data.length === 0) {
                        throw new Error('No levels ');
                    }

                    globals.gameEngine.level = data[0];

                    globals.gameEngine.game = new Game();
                    globals.gameEngine.game.levelId = data[0]._id;
                    globals.gameEngine.game.save();

                });


            } else {
                //use loaded game object
                globals.gameEngine.game = data[0];

                Level.find({_id:data[0].levelId}).limit(1).exec(function(err,data){

                    if (err) {
                        throw err;
                    }

                    if (data.length === 0) {
                        throw new Error('No levels ');
                    }

                    globals.gameEngine.level = data[0];

                });



            }


        }
    );



    res.render('game', {
    title: 'Default Game'
  });
};

