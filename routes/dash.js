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

<<<<<<< HEAD
function getProfile(req, res, next) {
  User.find(_id: req.session.userId, function (error, user) {
      if (error) {
        return next(error);
      }
      else {
        // if user has trip render dash with trips
        if (user.trips.length != 0) {

=======
function loadProfile(req, res, next) {
  return new Promise(function(resolve, reject) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) reject();
      else {
        // if user has trip render dash with trips
        if (user.trips.length != 0) {
>>>>>>> 8430b3e47fab7b3e28cfb75be7d7663442ba6c74
          Trip.find({'users':[user]}, 'title', function(err, result) {
            if (err) reject();
            resolve(result);
          });
<<<<<<< HEAD

        } else {
          console.log('no trips')
          return res.render('dash', {title: 'Logged In', firstName: user.firstName, lastName:user.lastName});
          }

      }
    });
=======
        } else { // Don't render trips
          resolve([]);
        }
      }
    });
  });
>>>>>>> 8430b3e47fab7b3e28cfb75be7d7663442ba6c74
}

// GET /Dash
// Check if user is authenticated
// ifso respond with main Dash
//
<<<<<<< HEAD
router.get('/', function(req, res, next) {
  //
  //  REMOVED FOR TESTING
  // if (! req.session.userId) {
  //   var err = new Error('You are not authorised to see this page.');
  //   err.status = 403;
  //   return next(err);
  // }


});
=======
router.get('/', renderAll);
>>>>>>> 8430b3e47fab7b3e28cfb75be7d7663442ba6c74


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
      // res.redirect('/dash')
      })
      }


});

});


// make routes for each destination to show select tasks
// the route parameter will be the id of the destination
// the post request will come from links in the destination list
// it will use dash view with objects from the task object inside project object
<<<<<<< HEAD
router.get('/:tripId', function(req, res, next) {
  // render tasks in this specific destination
=======
router.get('/:tripId', renderAll)

async function renderAll(req, res, next) {
   // render tasks in this specific destination
>>>>>>> 8430b3e47fab7b3e28cfb75be7d7663442ba6c74
  // User.findById(req.session.userId).trips
  // .exec(function (error, user) {
  //   if (error) {
  //     return next(error);
  //   } else {
  //     console.log(user)
<<<<<<< HEAD
  //   }
  console.log(req.params)

  // Find tripId with re


  res.render('dash', {title: 'Logged In', firstName: 'da', lastName: 've'})
})


=======
  //   } 
  var tripTitles = await loadProfile(req, res, next);

  return res.render('dash', {title: 'Logged In', tripName: tripTitles, firstName: 'da', lastName: 've'});
}

// });
>>>>>>> 8430b3e47fab7b3e28cfb75be7d7663442ba6c74





module.exports = router
