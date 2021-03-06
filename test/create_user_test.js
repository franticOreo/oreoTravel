//https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

var should = require('should')
var mongoose = require('mongoose');

var assert = require('assert')
// var DB = require('../../db')
var User = require('../models/user')
var userController = require('../controllers/user')

var user = {firstName: "test",
lastName: "test",
password: "lol",
email: "test@lol.com",
expertise: "rofln",
region: "Africa"}

describe('creating user test', function () {

  before(function (done) {
    db = mongoose.connect("mongodb://localhost:27017/oreoTravel");
    done()
  });

  after(function (done) {
    mongoose.connection.close();
    done();
  });
  console.log(true)

  beforeEach(function (done) {

    console.log(true)


    User.create(user, function(error) {
      if (error) console.log(error);
      else console.log('User created')
      done()
    });
        });

    it('return person data', function(done) {
      User.find({email:"test@lol.com"}, function(err, data) {
        assert.deepEqual([user.firstName], ['test'])
        console.log(true)
        done()
      });
    });

    afterEach(function (done) {
      User.remove({email:user.email}, function() {
        done();
      });
    });

});

///////////////////////////////////////////////////////////


describe('Authentication test', function () {

  before(function (done) {
    db = mongoose.connect("mongodb://localhost:27017/oreoTravel");
    done()
  });

  after(function (done) {
    mongoose.connection.close();
    done();
  });
  // console.log(true)

  beforeEach(function (done) {

    // console.log(true)


    User.statics.authenticate(req.body.email,req.body.password, function(error) {
      if (error) console.log(error);
      else console.log('User created')
      done()
    });
        });

    it('search for email in db', function(done) {
      User.find({email:req.body.email}, function(err, data) {
        assert.deepEqual([req.body.email], ['test@testtest.com'])
        console.log(true)
        done()
      });
    });

    afterEach(function (done) {
      User.remove({email:user.email}, function() {
        done();
      });
    });

});
