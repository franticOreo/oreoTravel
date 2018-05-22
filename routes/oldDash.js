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
        req.session.userId = user._id; // create session with mongo user id
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
//
router.get('/', function(req, res, next) {
  //
  //  REMOVED FOR TESTING
  // if (! req.session.userId) {
  //   var err = new Error('You are not authorised to see this page.');
  //   err.status = 403;
  //   return next(err);
  // }

  User.findById(req.session.userId)
    .exec(function (err, user) {
      if (err) {
        return next(err);
      } else {


          console.log(user)
          // if user has trip render dash with trips
          if (true) {
            console.log(user.trips)

            Trip.findUserTrips(req.session.userId, user.trips, function(err, tripNames) {
              if (err) {
                res.status = 500;
                res.render('error', {
                  message: err.message
                });
              }
              else {
                console.log("foundtrips:",tripNames)
                return res.render('dash', {title: 'Logged In', firstName: user.firstName, lastName:user.lastName});


              }
            })

          }


          else {
            console.log('no trips')
            return res.render('dash', {title: 'Logged In', firstName: user.firstName, lastName:user.lastName});

          }

        }

      });
    });


// update trip with trip details
// how to tell parent which children are there own?
router.post('/addtrip', function(req, res, next) {
  // pushes new trip to Trip array

  Trip.create({users:req.session.userId, title: req.body.tripName,
      region: req.body.region,
      country: req.body.country,
      city: req.body.city_state},
  function(err, data) {
    if (err) {
      res.status = 500;
      res.render('error', {
        message: err.message
      });
    } else {
      // req.session.tripId = data._id; NOT SURE IF SHOULD BE STORED IN SESH
      var tripId = data._id;
      User.update({_id:req.session.userId}, {$push: {trips: tripId}},
        function(err, data) {
          if (err) {
            res.status = 500;
            res.render('error', {
              message: err.message
            });
          } else {
            console.log(data, 'saved');
            res.redirect('/dash')
          }
      })
      }


});

});

// // update user schema by embedding trip schema(?) inside
// router.post('/addtrip', function(req, res, next) {
//   var newTrip = {
//     title: req.body.tripName,
//     region: req.body.region,
//     country: req.body.country,
//     city: req.body.city_state
//   }
//   // pushes new trip to the empty array in User schema
//   User.update({_id:req.session.userId}, {$push: {trips: newTrip}},
//   function(err, data) {
//     if (err) {
//       res.status = 500;
//       res.render('error', {
//         message: err.message
//       });
//     } else {
//       console.log(data,'saved');
//       res.redirect('/dash')
//     }
//   })
//
// });

// make routes for each destination to show select tasks
// the route parameter will be the id of the destination
// the post request will come from links in the destination list
// it will use dash view with objects from the task object inside project object
// router.get('/:tripId', function(req, res, next) {
//   // render tasks in this specific destination
//   User.findById(req.session.userId).trips
//   .exec(function (error, user) {
//     if (error) {
//       return next(error);
//     } else {
//       console.log(user)
//     }
//
//   res.render('dash', {title: 'Logged In', firstName: 'da', lastName: 've'})
// })
//
// });





module.exports = router
