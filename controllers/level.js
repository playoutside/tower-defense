var Level = require('../models/Level');
var _ = require('underscore');


exports.setupDefault = function(req, res) {
    var test = Level.find("{}");

    console.log(test);
    var defaultLevelList = require("../config/default-level.json");

    for (var i = 0; i < defaultLevelList.length; i++) {
        console.log('Loading Level ',i,' Data: ',defaultLevelList[i]);

        var level = _.extend(new Level(),defaultLevelList[i]);
        level.save();
    }

    console.log('Done loading default level data');

    res.render('test/debug');
};
