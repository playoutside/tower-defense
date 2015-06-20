
var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({

    /**
     * Id of configured level
     */
    levelId: { type: ObjectId, required: true },

    /**
     *
     */
    inventory: {
        creditsCollected:{type: Number, default:0}


    },

    players:[
        {
            userId:{
                type: ObjectId,
                required:true
            },
            position:{
                lat:{type: Number},
                lon:{type: Number}
            }
        }
    ],
    status:{
        type:String,
        enum: ['active','ended','deleted'],
        default: 'active',
        required:true
    }





});



module.exports = mongoose.model('Game', gameSchema);
