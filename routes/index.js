var express = require('express');
var router = express.Router();
var User = require('../models/user');

var renderText = { title: 'Oreo Travel', first: 'John', last: 'Smith'};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('Welcome', renderText);
});

router.get('/dash', function(req, res) {
  res.render('Dash', renderText);
  if (error) {
    console.log(error)
  }
});

// POST when Sign In form is completed
// if successful redirects user to main Dash'
router.post('/dash', function(req, res, next) {
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
    console.log('1')

    User.create(userData, function(error , user) { // use the mongoose model, users
        if (error) {                               // and place the form data in it
          return next(error);                      // if no error go dash
        } else {
          return res.redirect('/dash');
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
