var mongoose = require('mongoose');
var TaskSchema = require('./task')
var Schema = mongoose.Schema;
var TripSchema = require('./user.js')

//  NOT USED ATM ONLY USED IF USING REFERENCE

var TripSchema = new mongoose.Schema(
    {
        users: [{type: Schema.Types.ObjectId, ref: 'UserSchema' }],
        tasks: [TaskSchema],
        title: String,
        description: String,
        region: String,
        country: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        }
    }
);


var Trip = mongoose.model('Trip', TripSchema); // creates model name and points to schema
                                                // it wants to use
module.exports = Trip;
