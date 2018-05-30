var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {

  // if there is no session respond with unauthorised
  if(!req.session.userId){
    var err = new Error('You are not authorised to be here matey');
    err.status = 403; // 403 is a forbidden HTTP status code
    //return next(err)
    return res.redirect('/'); // Redirect User to login rather than display error
  }
  // retrieve user data from mongo using session id
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        //return next(err)
        return res.redirect('/'); // Redirect User to login rather than display error
      } else { //display user info on dash
        res.render('dash', {title: 'Oreo Travel' , tripName: [], firstName:user.firstName, lastName:user.lastName , intro:'Get Started by Finding Users and then adding tasks'
            });
      }

    })
});


// POST when Sign In form is completed
// if successful redirects user to Signed Up dash (/welcome)
// SUGGESTION: Add Welcome Message: Welcome to oreoTravel!!!
router.post('/', function(req, res, next) {
  if (req.body.firstName,
      req.body.lastName,
      req.body.password,
      req.body.email,
      req.body.expertise,
      req.body.region) { //if all fields entered in signup form

        // need to check for duplicate email
        //
    var userData = {                //create object with form input
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
      expertise: req.body.expertise,
      region: req.body.region,
      country: req.body.country,
      city_state: req.body.city_state
    }

    User.create(userData, function(error , user) { // use the mongoose model, users
        if (error) {                               // and place the form data in it
          return next(error);                      // if no error go welcome
        } else {
          req.session.userId = user._id; // create session for new user
          req.session.prefferedDest = {region:user.region, country:user.country, city_state:user.city_state}
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
