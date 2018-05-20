var mongoose = require('mongoose');



var TripSchema = new mongoose.Schema(
    {
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


Trip = mongoose.model('Project', TripSchema);

module.exports = Trip
