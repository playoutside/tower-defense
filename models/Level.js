
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
     * Max duration of game in seconds
     */
    duration: Number,
    /**
     * Time between waves in seconds
     */
    waveInterval: Number,

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
        max:{type: Number,default:16}

    },

    /**
     * Path the creeps will take. First element will be the player base. Last element will be the creep spawn point.
     *
     */
    path:[
        {
            lat:{type: Number},
            lon:{type: Number}
        }
    ],

    /**
     * Locations to build turrets at
     */
    turretSites:[
        {
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
            {
                position:{
                    lat:{type: Number},
                    lon:{type: Number}
                }
            }
        ],
        available:[
            {
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
