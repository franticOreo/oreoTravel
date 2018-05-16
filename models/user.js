var mongoose = require('mongoose');
var bcrypt = require('bcrypt')

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
// authenticate input against db docs
// creating authenticate method
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
    .exec(function(error, user) {
      if (error) {
        return callback(error);
      } else if ( !user ) {
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(error, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    })
}

// hash password before saving to db
UserSchema.pre('save', function (next) {
  var user = this; //holds users data
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err); // evetually gets passed onto error in app.js
    }
    user.password = hash;
    next();
  })
})

var User = mongoose.model('User', UserSchema); // creates model name and points to schema
                                                // it wants to use
module.exports = User;
