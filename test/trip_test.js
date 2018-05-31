var Trip = require('../models/trip');
var tripController = require('../controllers/trip')
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;


module.exports.addTrip = function(req, res, next) {
  // pushes new trip to Trip array

  Trip.create({
    users:req.session.userId,
    title: req.body.tripName,
    region: req.body.region,
    country: req.body.country,
    city: req.body.city_state
  },
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
}



// describe("trip route test", function () {
//   describe("Create trip", function () {
//     it("respond with", function () {
//       var req, res, spy
//
//       req = res = {};
//       spy = res.send = sinon.spy();
//
//       tripController.addTrip(req, res)
//       expect(spy.calledOnce).to.equal(true);
//
//     })
//   })
// })
