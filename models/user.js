var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  expertise: {
    type: String,
    required: true,
    trim: true
  }

});

var User = mongoose.model('User', UserSchema); // creates model name and points to schema
                                                // it wants to use
module.exports = User;
