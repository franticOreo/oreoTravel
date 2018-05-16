var express = require('express');
var router = express.Router();
var User = require('../models/user');

var renderText = { title: 'Oreo Travel', first: 'John', last: 'Smith'};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', renderText);
});

router.get('/welcome', function(req, res) {
  res.render('dash', {title: user.firstName, intro:'Get Started by Finding Users and then adding tasks'
      });
  if(req.session.userId){
    console.log(true)
  }
});



// router.get('/dash', function(req, res) {
//   res.render('Dash', renderText);
//   if (error) {
//     console.log(error)
//   }
// });

// GET Dash
// Response when User successfully logs in
// router.get('/Dash', function (req, res, next) {
//   return res.render('login', {title: 'Log In '});
// });

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
        return res.render('dash', {title: 'Logged In', name: user.name});
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
