var express = require('express');
var router = express.Router();
var User = require('../models/user');
var createUser = require('../controllers/createUser')

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
router.post('/', createUser);


module.exports = router;
