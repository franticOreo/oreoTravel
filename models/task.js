var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  taskName: {
    type: String

  }
  taskDescription: {
    type: String
  }

});

var Task = mongoose.model('User', TaskSchema); // creates model name and points to schema
                                                // it wants to use
module.exports = Task;
