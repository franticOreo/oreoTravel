var expect = require('chai').expect;
var should = require('should')
var assert = require('assert')
// var DB = require('../../db')
var fixtures = require('../models/user')
var createUser = require('../controllers/createUser')
var mongoose = require('mongoose')
var User = require('../models/user');

// Sanity Check


// Test suite
// block of unit tests
describe('Mocha', function () {
  // Test spec (unit test)
  it('should run our test using npm', function() {
    expect(true).to.be.ok;
  });
});


/////////////////////////////////////////////////////////



describe('creating user test', function () {

  before(function (done) {
    db = mongoose.connect("mongodb://franticOreoMinion:lol@ds119350.mlab.com:19350/oreo_travel_db");
    done()
  })

  after(function (done) {
    mongoose.connection.close();
    done();
  })

  beforeEach(function (done) {
    var user = { 
      firstName: "test",
      lastName: "test",
      password: "lol",
      email: "test@lol.com",
      expertise: "rofln",
      region: "Africa"
    }

    User.create(user, function(error) {
      if (error) console.log(error);
      else console.log('User created')
      done()
    })
  })

  it('return person data', function(done) {
    User.find({email:"test@lol.com"}, function(err, data) {
      assert.deepEqual([data.firstName], ['test'])
      console.log(true)
      done()
    })
  })

  afterEach(function (done) {
    User.remove({}, function() {
      done();
    })
  })
})
