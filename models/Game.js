
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new mongoose.Schema({

    /**
     * Id of configured level
     */
    levelId: { type: Schema.ObjectId, required: true, ref: 'Level' },



    /*
    //todo  add again when we implement multi match gaming

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
    ],*/
    status:{
        type:String,
        enum: ['active','ended','deleted'],
        default: 'active',
        required:true
    }

});


//todo getStatus --> Returns status infos for client... (map config )


/**
 *
 */
gameSchema.methods.getStatus = function( callback) {


};

module.exports = mongoose.model('Game', gameSchema);
