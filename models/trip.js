var mongoose = require('mongoose');



var TripSchema = new mongoose.Schema(
    {
        title:String,
        region: String,

    }
);


Trip = mongoose.model('Project', TripSchema);

module.exports = Trip
