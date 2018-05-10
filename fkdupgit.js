var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('Welcome');
});


router.post('/dash', function(req, res, next) {
  if (req.body.firstName,
      req.body.lastName,
      req.body.password,
      req.body.email,
      req.body.expertise) { //if all fields entered in signup form

    var userData = {                //create object with form input
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
      expertise: req.body.expertise
    }

    User.create(userData, function(error , user) { // use the mongoose model, users
        if (error) {                               // and place the form data in it
          return next(error);                      // if no error go dash
        } else {
          return res.redirect('/dash');
        }

    })
  }
});



module.exports = router;


//


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
