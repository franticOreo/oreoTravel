var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Trip = require('../models/trip');


// POST login
// When User Logins In from index
// Check for correct credentials
// if correct create a session ID with userID from mongo
//
router.post('/', function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id; // create session
        return res.redirect('/dash');
      }
    });

  } else {
    var err = new Error('Email and password required')
    err.status = 400;
    return next(err);
  }
});

// GET /Dash
// Check if user is authenticated
// ifso respond with main Dash
router.get('/', function(req, res, next) {
  if (! req.session.userId) {
    var err = new Error('You are not authorised to see this page.');
    err.status = 403;
    return next(err);
  }

  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('dash', {title: 'Logged In', tripName:user.trips, firstName: user.firstName, lastName:user.lastName});
      }
    });
});


router.post('/addtrip', function(req, res, next) {
  new Trip({
    title: req.body.tripName,
    region: req.body.region,
    country: req.body.country,
    city: req.body.city_state
  }).save(function (err, trip, count) {
    if (err) {
      return err;
  } else {
    res.redirect('/dash');
  }
});
});



module.exports = router
