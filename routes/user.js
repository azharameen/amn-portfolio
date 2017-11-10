var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('pages/index', {
		title: 'AMN Offers',
		usermode: 'user',
		loggedIn: false
	});
});


router.use(function(req, res, next) {
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	jwt.verify(token, 'appAMeeN', function(err, decoded) {			
		if (err) {
			res.json({status:'Failed to authenticate token.'});
		} else {
			if(decoded.usermode != 'user'){
				res.json({status:'You are not authorized, not a valid user.'});
			}else{
				next();
			}
		}
	});
});


/* GET users listing. */
router.get('/thulasi', function(req, res, next) {
  res.send('respond with a resource, got thulasi route');
});


module.exports = router;
