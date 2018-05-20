var mongoose = require('mongoose');
var TripSchema = require('./trip.js')

var TaskSchema = new mongoose.Schema({
  taskName: {
    type: String

  },
  taskDescription: {
    type: String
  }

});


module.exports = TaskSchema;
