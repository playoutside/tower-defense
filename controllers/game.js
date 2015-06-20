var Level = require('../models/Level');
var Game = require('../models/Game');

/**
 * GET /game
 * Running game.
 */
exports.index = function(req, res) {

    Game.find({status:'active'}).limit(1).exec(

        function(err,data) {



            if (err) {
                throw err;
            }

            if ( data.length === 0) {
                console.log('No active game found. Spawning new game.');

                //todo: Return a list of available levels OR option to create a map
                //for now... select the first level available and use it

                Level.find("{}").limit(10).exec(function(err,data){

                    if (err) {
                        throw err;
                    }

                    if (data.length === 0) {
                        throw new Error('No levels ');
                    }

                    console.log('Loading default level done...',data);

                    global.gameEngine.level = data[0];

                    global.gameEngine.game = new Game();
                    global.gameEngine.game.levelId = data[0]._id;
                    global.gameEngine.game.save();

                    res.render('game', {
                        title: 'New Game "'+data[0].name+'"'
                    });


                });


            } else {
                console.log('Active game found');

                //use loaded game object
                global.gameEngine.game = data[0];

                Level.find({_id:data[0].levelId}).limit(1).exec(function(err,data){

                    if (err) {
                        throw err;
                    }

                    if (data.length === 0) {
                        throw new Error('No levels ');
                    }

                    global.gameEngine.level = data[0];

                    res.render('game', {
                        title: 'Playing now  "'+data[0].name+'"'
                    });

                });




            }


        }
    );




};

