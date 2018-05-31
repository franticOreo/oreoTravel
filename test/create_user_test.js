//https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

var should = require('should')
var assert = require('assert')
// var DB = require('../../db')
var fixtures = require('../models/user')
var userController = require('../controllers/user')

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
    var user = {firstName: "test",
    lastName: "test",
    password: "lol",
    email: "test@lol.com",
    expertise: "rofln",
    region: "Africa"}
    console.log(true)

    User.create(user, function(error) {
      if (error) console.log(error);
      else console.log('User created')
      done()
    });

    it('return person data', function(done) {
      User.find({email:"test@lol.com"}, function(err, data) {
        assert.deepEqual([data.firstName], ['test'])
        console.log(true)
        done()
      });
    });

    afterEach(function (done) {
      User.remove({}, function() {
        done();
      });
    });
  });
});
