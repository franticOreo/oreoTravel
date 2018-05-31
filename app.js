var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');



var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var dashRouter = require('./routes/dash');
var welcomeRouter = require('./routes/welcome');

var app = express();




// use session module for tracking logins
app.use(session({
  secret: 'oreoTravelSecret', //sign the session id cookie
  resave: true,
  saveUninitialized: false
}));





var dbURI = "mongodb://localhost:27017/oreoTravel"
// var dbURI = "mongodb://franticOreoMinion:lol@ds119350.mlab.com:19350/oreo_travel_db"


mongoose.connect(dbURI, function (err,database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

var db = mongoose.connection;

db.on('connected', function () {
  console.log('Mongoose connected to '+ dbURI)
})

db.on('error', function () {
  console.log('Mongoose connectedion error '+ dbURI)
})

db.on('error', console.error.bind(console, 'connection error: '))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/dash', dashRouter);
app.use('/welcome', welcomeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/getData', function (req, res) {
  db.open(function (err, db) {
      assert.equal(null, err);
      var cursor = db.collection(TripSchema).find().limit(1).sort({ $natural: -1 });
      cursor.each(function (err, doc) {
          assert.equal(err, null);
          if (doc != null) {
              res.status(200).json(doc);
              return;
          }
      });
  });
});


module.exports = app;
