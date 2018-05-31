var should = require('should')
var mongoose = require('mongoose');

var assert = require('assert')
// var DB = require('../../db')
var User = require('../models/user')
var userController = require('../controllers/user')

var email = "test@testtest.com";
var password = "lol";

// User.statics.authenticate = function(email, password, callback) {
//   // set up mongoose query to search for email
//   User.findOne({ email: email })
//     .exec(function(error, user) {
//       if (error) {
//         return callback(error);
//       } else if ( !user ) {
//         return callback();
//         // error.status = 401; // if error with mongoose query
//         // return callback(error);
//       }
//       // comaare hashed password with plain text password
//       // callback 'result' returns either true or false
//       bcrypt.compare(password, user.password, function(error, result) {
//         if (result === true) {
//           // callback param is null because result was true
//           return callback(null, user);
//         } else {
//           return callback();
//         }
//       })
//     })
// }

describe('Authentication test', function () {

  before(function (done) {
    db = mongoose.connect("mongodb://localhost:27017/oreoTravel");
    done()
  });

  after(function (done) {
    mongoose.connection.close();
    done();
  });
  // console.log(true)

  beforeEach(function (done) {

    // console.log(true)


    User.statics.authenticate(req.body.email,req.body.password, function(error) {
      if (error) console.log(error);
      else console.log('User created')
      done()
    });
        });

    it('search for email in db', function(done) {
      User.find({email:req.body.email}, function(err, data) {
        assert.deepEqual([req.body.email], ['test@testtest.com'])
        console.log(true)
        done()
      });
    });

    afterEach(function (done) {
      User.remove({email:user.email}, function() {
        done();
      });
    });

});
