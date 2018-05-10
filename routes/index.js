var express = require('express');
var router = express.Router();

var renderText = { title: 'Oreo Travel', first: 'John', last: 'Smith'};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('Welcome', renderText);
});

router.post('/dash', function(req, res) {
  req.
  res.render('Dash', renderText);
});



module.exports = router;
