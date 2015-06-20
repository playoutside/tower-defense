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

                    globals.gam

                });


            } else {
                //use loaded game object


            }


        }
    );



    res.render('game', {
    title: 'Default Game'
  });
};

