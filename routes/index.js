var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Oreo Travel'});
});

router.get('/welcome', function(req, res, next) {

  // if there is no session respond with unauthorised
  if(!req.session.userId){
    var err = new Error('You are not authorised to be here matey');
    err.status = 403; // 403 is a forbidden HTTP status code
    return next(err)
  }
  // retrieve user data from mongo using session id
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error)
      } else { //display user info on dash
        res.render('dash', {title: 'Oreo Travel' ,firstName:user.firstName, lastName:user.lastName , intro:'Get Started by Finding Users and then adding tasks'
            });
      }

    })
});


// POST login
// When User Logins In from index
// Check for correct credentials
// if correct create a session ID with userID from mongo
//
router.post('/dash', function (req, res, next) {
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
router.get('/dash', function(req, res, next) {
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
        return res.render('dash', {title: 'Logged In', firstName: user.firstName});
      }
    });
});

// POST when Sign In form is completed
// if successful redirects user to Signed Up dash (/welcome)
// SUGGESTION: Add Welcome Message: Welcome to oreoTravel!!!
router.post('/welcome', function(req, res, next) {
  if (req.body.firstName,
      req.body.lastName,
      req.body.password,
      req.body.email,
      req.body.expertise) { //if all fields entered in signup form

        // need to check for duplicate email
        //
    var userData = {                //create object with form input
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
      expertise: req.body.expertise
    }

    User.create(userData, function(error , user) { // use the mongoose model, users
        if (error) {                               // and place the form data in it
          return next(error);                      // if no error go welcome
        } else {
          req.session.userId = user._id; // create session for new user
          return res.redirect('/welcome');
        }

    });
  }
   else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
  }

});



module.exports = router;
