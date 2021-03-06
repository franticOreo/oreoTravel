var User = require('../models/user');

module.exports.createUser = function createUser(req, res, next) {
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

}

module.exports.verifyUser = function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id; // create session with mongo user id
        req.session.prefferedDest = {region:user.region, country:user.country, city_state:user.city_state}

        return res.redirect('/dash');
      }
    });
  } else {
    var err = new Error('Email and password required')
    err.status = 400;
    return next(err);
  }
}

// module.exports = createUser
