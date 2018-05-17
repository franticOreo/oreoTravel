var mongoose = require('mongoose');



var TripSchema = new mongoose.Schema(
    {
        title:String,
        description: String,

    }
);


Trip = mongoose.model('Project', TripSchema);

module.exports = Trip
