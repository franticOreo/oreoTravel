var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Trip = require('../models/trip');

// POST login
// When User Logins In from index
// Check for correct credentials
// if correct create a session ID with userID from mongo
router.post('/', function(req, res, next) {
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

// return root of dash if user has no trip
// else respond with first tripId root
router.get('/', renderAll);

// make routes for each destination to show select tasks
// the route parameter will be the id of the destination
// the post request will come from links in the destination list
// it will use dash view with objects from the task object inside project object
router.get('/:tripId', renderAll);

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

router.post('/:tripId/addtask', (req, res, next) => {
  var b = req.body;
  console.log(b);
  Trip.update(
    { _id: req.params.tripId },
    {
      $push: {
        tasks: {
          name: b.name,
          description: b.description,
          date: b.date,
          priority: b.priority,
          assign: [req.session.userId] // <-- Change this to selectable at some point
        }
      }
    },
    (err, data) => {
      if (err) {
        res.status = 500;
        res.render('error', { message: err.message });
      } else {
        console.log(data);
        res.redirect('/dash/' + req.params.tripId)
      }
    }
  );
});

//
// Loading data and rendering functions
//

function loadUser(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
    .exec(function (error, user) {
      if (error) throw error;
      resolve(user);
    });
  })
}

function loadTrips(user) {
  // if user has trip render dash with trips
  return new Promise((resolve, reject) => {
    if (user.trips.length != 0) {
      Trip.find({'users':[user]}, (err, result) => {
        if (err) reject();
        resolve(result);
      });
    }
    else {
      // Don't render trips
      resolve([]);
    }
  })
}

async function renderAll(req, res, next) {

  // Load in user and trip data
  var user = await loadUser(req.session.userId);
  var trips = await loadTrips(user);

  // Get the list of tasks corresponding to the id
  var taskList = [];
  if (req.params['tripId']) {
    for (var i = 0; i < trips.length; i++) {
      if (trips[i]._id = req.params['tripId']) {
        taskList = trips[i].tasks;
      }
    }
  }

  console.log(req.params['tripId']);
  console.log(taskList);
  // console.log(trips);

  // Render - last
  return res.render('dash', {
    title: 'Logged In',
    tripName: trips,
    firstName: user.firstName,
    lastName: user.lastName,
    tasks: taskList,
    selectedTrip: req.params['tripId']
  });
}

module.exports = router



// make routes for each destination to show select tasks
// the route parameter will be the id of the destination
// the post request will come from links in the destination list
// it will use dash view with objects from the task object inside project object
