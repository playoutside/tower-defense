
var mongoose = require('mongoose');

var levelSchema = new mongoose.Schema({
    /**
     * Name of Level
     */
    name: String,
    /**
     * Version of Level
     */
    version: String,
    /**
     * Max number of players
     */
    maxPlayer: Number,

    /**
     * City of game
     */
    city: String,


    /**
     * Creep wave spawn cycle
     *
     * duration: length of a spawn wave in seconds
     * delay: time between spawn waves in seconds
     * creepCount: how many creeps per wave
     */
    wave:{
        duration:{type:Number},
        delay:{type:Number},
        creepCount:{type:Number}
    },

    /**
     * First Wave creep has hitPoints, 2nd wave creep has increment more hitpoints etc...
     * hitPoints -- Basic hit points first level
     * increment -- Hitpoint gain per wave
     * speed-- min max value in meters per second
     */
    creep:{
      hitPoints:{type:Number},
      increment:{type:Number},
      speed:{
          min:{type:Number},
          max:{type:Number}
      }

    },

    /**
     * damage of Level 1 tower
     * increment damage gained per tower level
     * range of tower in meters
     */
    tower:{
        damage:{type:Number},
        increment:{type:Number},
        range:{type:Number}
    },

    /**
     * Map Center
     *
     */
     mapCenter:{
        lat:{type: Number},
        lon:{type: Number}
    },

    /**
     *  Max and Min zoom Level
     */
    zoom:{
        min:{type: Number,default:1},
        max:{type: Number,default:16},
        initial:{type: Number,default:5}

    },

    /**
     * Path the creeps will take. First element will be the player base. Last element will be the creep spawn point.
     *
     */
    path:[
        {   _id:false,
            lat:{type: Number},
            lon:{type: Number}
        }
    ],

    /**
     * Locations to build turrets at
     */
    turretSites:[
        {   _id:false,
            position:{
                lat:{type: Number},
                lon:{type: Number}
            },
            size:{type: Number}
        }
    ],

    /**
     * Item definition and possible spawn positions
     */
    items: {
        spawnPoints:[
            {   _id:false,
                position:{
                    lat:{type: Number},
                    lon:{type: Number}
                }
            }
        ],
        available:[
            {   _id:false,
                name:{type:String},
                value:{type:Number},
                mode:{
                    type: String,
                    enum: ['pickup','carry-back']
                },
                respawn:{type:Number}

            }
        ]
    }

});



module.exports = mongoose.model('Level', levelSchema);
