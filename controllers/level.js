var Level = require('../models/Level');
var _ = require('underscore');


exports.setupDefault = function() {
    var levelsAvailable = Level.find("{}").limit(10).exec(function(err,data){
        if (err) {
            return err;
        }

        if (data.length === 0) {
            var defaultLevelList = require("../config/default-level.json");

            for (var i = 0; i < defaultLevelList.length; i++) {
                console.log('Loading Level ', i, ' Data: ', defaultLevelList[i]);

                var level = _.extend(new Level(), defaultLevelList[i]);
                level.save();
            }

            console.log('Done initializing default level data');
            return true;
        } else {
            console.log('Levels already loaded');
            return true;
        }
    });


};
