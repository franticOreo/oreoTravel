var mongoose = require('mongoose');
var TaskSchema = require('./task')
var Schema = mongoose.Schema;
var UserSchema = require('./user.js')


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

// ////// NOT WORKING
// TripSchema.statics.findUserTrips = function findUserTrips(userId, tripIds, callback) {
//     var tripTitles = [];
//     for (var i = 0; i < tripIds.length; i++) {
//       Trip.find(_id:tripIds[i], function (err, trip) {
//         if (err) {
//           return next(err);
//         } else {
//           tripTitles.push(trip.title)
//         }
//       })
//     } callback();
//     // console.log(tripTitles)
// }


var Trip = mongoose.model('Trip', TripSchema); // creates model name and points to schema
                                                // it wants to use
module.exports = Trip;
