var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Trip = require('../models/trip');
var userController = require('../controllers/user')
var tripController = require('../controllers/trip')


// POST login
// When User Logins In from index
// Check for correct credentials
// if correct create a session ID with userID from mongo
router.post('/', userController.verifyUser);

// Render Dash
router.get('/', renderDashResponse);

// logout
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/')
})

// Send list of trips with all releventant data
router.get('/trips', getTripsResponse);

// Load the tasks for a trip
router.get('/task/:tripId', getTasksResponse);

// Add a task to a trip
router.post('/task/:tripId', addTaskResponse);

// Delete a task
router.delete('/task/:tripId/:taskId', deleteTaskResponse);

// Done/Undo a task
router.put('/task/:tripId/:taskId/:done', doneTaskResponse);

// update trip with trip details
router.post('/addtrip', tripController.addTrip);

router.post('/joinTrip/:tripId', joinTripResponse);

router.get('/search', SearchForTripsReponse);

//
// Response Functions -------------------------------------------------------------------------
//

async function renderDashResponse(req, res, next) {

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

  // Render - last
  return res.render('dash', {
    title: 'Logged In',
    tripName: trips,
    firstName: user.firstName,
    lastName: user.lastName,
    selectedTrip: req.params['tripId']
  });
}

async function getTripsResponse(req, res, next) {
  var user = await loadUser(req.session.userId);
  var trips = await loadTrips(user);

  var usersNames = [];
  for (var i = 0; i < trips.length; i++) {
    usersNames[i] = await loadUserNames(trips[i].users);
  }

  res.type('json');
  res.send({trips: trips,  names: usersNames});
}

async function getTasksResponse(req, res, next) {
  var tasks = await loadTasks(req.params['tripId']);
  res.type('json');
  res.send(tasks);
}

async function addTaskResponse(req, res, next) {
  // await Trip.remove({});
  await addTask(req);
  getTasksResponse(req, res, next);
}

async function deleteTaskResponse(req, res, next) {
  await deleteTask(req);
  getTasksResponse(req, res, next);
}

async function doneTaskResponse(req, res, next) {
  await doneTask(req);
  getTasksResponse(req, res, next);
}

async function joinTripResponse(req, res, next) {
  await joinTrip(req);
  res.send();
}

async  function SearchForTripsReponse(req, res, next) {
  var trips = await getMatchingTrips(req);
  res.send(trips);
}

//
// Database Functions -------------------------------------------------------------------------
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
  return new Promise((resolve, reject) => {
    if (user.trips.length != 0) {
      Trip.find({ users: { $in: [user] } }, (err, result) => {
        if (err) reject();
        resolve(result);
      });
    }
    else resolve([]);
  })
}

function joinTrip(req) {
  return new Promise((resolve, reject) => {
    User.update(
      { _id: req.session.userId },
      { $push: { trips: req.params.tripId } },
      (err, result) => {
        if (err) {
          console.log(err.message);
          reject();
        }
        Trip.update(
          { _id: req.params.tripId },
          { $push: { users: req.session.userId } },
          (err2, result2) => {
            if (err) {
              console.log(err.message);
              reject();
            }
            console.log(result);
            console.log(result2);
            resolve(result2);
          }
        )
      }
    )
  })
}

function loadUserNames(users) {
  return new Promise((resolve, reject) => {
    if (users.length != 0) {
      User.find(
        { _id: { $in: users } },
        { firstName: 1, lastName: 1},
        (err, result) => {
          if (err) reject();
          resolve(result);
        }
      );
    }
    else resolve([]);
  })
}

function loadTasks(tripId) {
  return new Promise((resolve, reject) => {
    Trip.find({_id: tripId}, {tasks: 1}, (err, result) => {
      if (err) {
        console.log(err.message);
        reject();
      }
      resolve(result[0].tasks);
    })
  })
}

function addTask(req) {
  var b = req.body
  return new Promise((resolve, reject) => {
    Trip.update(
      { _id: req.params.tripId },
      {
        $push: {
          tasks: {
            name: b.name,
            description: b.description,
            date: Date.parse(b.date),
            priority: b.priority,
            assign: [req.session.userId], // <-- Change this to selectable at some point
            done: b.done
          }
        }
      },
      (err, data) => {
        if (err) reject();
        resolve();
      }
    );
  })
}

function deleteTask(req) {
  return new Promise((resolve, reject) => {
    Trip.update(
      { _id: req.params.tripId },
      { $pull: { tasks: { _id: req.params.taskId } } },
      (err, data) => {
        if (err) {
          console.log(err.message);
          reject();
        }
        resolve();
      }
    )
  })
}

function doneTask(req) {
  return new Promise((resolve, reject) => {
    Trip.findOne(
      { _id: req.params.tripId },
      (err, result) => {
        if (err) {
          console.log(err.message);
          reject();
        }
        result.tasks.id(req.params.taskId).done = req.params.done == "done";
        Trip.update(
          { _id: req.params.tripId },
          { tasks: result.tasks },
          (err, data) => {
            if (err) {
              console.log(err.message);
              reject();
            }
            resolve();
          }
        )
      }
    )
  })
}

function getMatchingTrips(req) {
  return new Promise((resolve, reject) => {
    var d = req.session.prefferedDest;
    Trip.aggregate([
      {$match: {users: {$nin: [req.session.userId]}}},
      {
        $facet: {
          city: [
              {$match: {city: d.city_state}},
              {$addFields: {weight: 0}}
          ],
          country: [
              {$match: {country: d.country, city: {$ne: d.city_state}}},
              {$addFields: {weight: 1}}
          ],
          region: [
              {$match: {region: d.region, country: {$ne: d.country}}},
              {$addFields: {weight: 2}}
          ],
          global: [
            {$match: {region: {$ne: d.region}}},
            {$addFields: {weight: 3}}
          ]
        }
      },
      {$project: {doc: {$concatArrays: ["$city", "$country", "$region", "$global"]}}},
      {$unwind: "$doc"},
      {$sort: {"doc.weight": 1}},
      {$limit: 10},
      {$project: {_id: "$doc._id", title: "$doc.title", region: "$doc.region", country: "$doc.country", city: "$doc.city"}}
    ])
    .exec(function (error, data) {
      if (error) throw error;
      console.log(req.session.userId);
      console.log(data);
      resolve(data);
    });
  })
}

module.exports = router

// make routes for each destination to show select tasks
// the route parameter will be the id of the destination
// the post request will come from links in the destination list
// it will use dash view with objects from the task object inside project object
