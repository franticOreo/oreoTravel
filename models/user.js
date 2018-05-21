var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var TripSchema = require('./trip.js')


// var UserSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true,
//   },
//   expertise: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   trips: [TripSchema]
//
// });

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
  },
  trips: [{type: Schema.Types.ObjectId, ref: 'TripSchema' }]

});




// authenticate input against db docs
// creating authenticate method
UserSchema.statics.authenticate = function(email, password, callback) {
  // set up mongoose query to search for email
  User.findOne({ email: email })
    .exec(function(error, user) {
      if (error) {
        return callback(error);
      } else if ( !user ) {
        err.status = 401; // if error with mongoose query
        return callback(err);
      }
      // comaare hashed password with plain text password
      // callback 'result' returns either true or false
      bcrypt.compare(password, user.password, function(error, result) {
        if (result === true) {
          // callback param is null because result was true
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
