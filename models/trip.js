var mongoose = require('mongoose');
var TaskSchema = require('./task')

//  NOT USED ATM ONLY USED IF USING REFERENCE

var TripSchema = new mongoose.Schema(
    {
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


module.exports = TripSchema
