var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Oreo Travel'});
});


module.exports = router;
