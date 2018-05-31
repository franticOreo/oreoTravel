// https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

var expect = require('chai').expect;
var sinon = require('sinon')
// var test = require('sinon').test
var User = require('../models/user.js')


// set up model to fail validation
it('User validation test', sinon.test(function () {
  this.stub(User, 'findOne');
  var email = 'test@test.com';
  var u = new User({email: email});

  u.statics.authenticate(User.findOne, {
    email: email
  })
}))
