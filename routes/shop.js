var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');

/* GET shops listing. */
router.get('/', function(req, res, next) {
	res.render('pages/index', {
		title: 'AMN Offers',
		usermode: 'shop',
		loggedIn: false
	});
});

router.use(function(req, res, next) {
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	jwt.verify(token, 'appAMeeN', function(err, decoded) {			
		if (err) {
			res.json({status:'Failed to authenticate token.'});
		} else {
			console.log('Success authenticate token.', decoded);		
			next();
		}
	});
});

/* GET users listing. */
router.get('/thulasi', function(req, res, next) {
  res.send('respond with a resource, got thulasi route');
});


module.exports = router;
