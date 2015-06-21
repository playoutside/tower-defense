var Level = require('../models/Level');
var _ = require('underscore');


exports.setupDefault = function(done) {
    var levelsAvailable = Level.find("{}").limit(10).exec(function(err,data){
        if (err) {
            return done(err);
        }

        if (data.length === 0) {
            var defaultLevelList = require("../config/default-level.json");

            for (var i = 0; i < defaultLevelList.length; i++) {
                console.log('Loading Level ', i, ' Data: ', defaultLevelList[i]);

                var level = _.extend(new Level(), defaultLevelList[i]);

                //we are done after the last level object has been saved successfully
                if ( i === (defaultLevelList.length-1)) {
                    level.save(
                        function (err, data) {
                            if (err) {
                                throw err;
                            }
                            console.log('Done initializing default level data');
                            done();
                        }
                    );
                } else {
                    level.save();
                }

            }

        } else {
            console.log('Levels already loaded');
            done();
        }
    });


};
