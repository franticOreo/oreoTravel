var express = require('express');
var router = express.Router();

router.get('/hello', function(req, res, next) {
  res.render('hello', { greeting: 'help' });
});



module.exports = router;
