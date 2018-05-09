var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('Welcome');
});

router.post('/dash', function(req, res) {
  res.render('Dash');
});



module.exports = router;
