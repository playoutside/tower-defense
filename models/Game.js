
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new mongoose.Schema({

    /**
     * Id of configured level
     */
    levelId: { type: Schema.ObjectId, required: true, ref: 'Level' },

    /**
     *
     */
    inventory: {
        creditsCollected:{type: Number, default:0}


    },

    players:[
        {
            userId:{
                type: Schema.ObjectId,
                ref:'User',
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
