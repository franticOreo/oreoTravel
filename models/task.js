var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TripSchema = require('./trip.js');

var TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  priority: Number,
  assign: [{type: Schema.Types.ObjectId, ref: 'UserSchema' }],
  done: Boolean
});

module.exports = TaskSchema;
