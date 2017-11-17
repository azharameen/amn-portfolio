var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('pages/index', {
		title: 'AMN Offers',
		usermode: 'guest',
		loggedIn: true

	});
});

router.post('/auth', function (req, res) {
	var user = req.body.user;
	var pass = req.body.pass;
	var data = {};
	if(user == 'amn' && pass == 'amn'){
		data = {
			name:'ameen User',
			usermode:'user'
		}
	}else if(user == 'ameen' && pass == 'ameen'){
		data = {
			name:'ameen Shop',
			usermode:'shop'
		}
	}else if(user == 'admin' && pass == 'admin'){
		data = {
			name:'ameen Admin',
			usermode:'admin'
		}
	}

	if(data.usermode){
		var token = jwt.sign(data, 'appAMeeN');
		res.json({success:true, token:token, userdata:data});
	}else{
		res.json({success:false, msg:'Username or Password in invalid'});
	}
});

router.post('/secretKey', function (req, res) {
	if(req.body.pro_name){
		var token = jwt.sign({
			name : req.body.pro_name,
			path : req.body.pro_name.replace(/\s/g, '_'),
			url : req.body.pro_url,
			table : req.body.table_name
		}, 'appAMeeN');
		res.json({success:true, token:token});
	}else{
		res.json({success:false, msg:'Username or Password in invalid'});
	}
});

router.post('/auth-check', function(req, res, next) {
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	jwt.verify(token, 'appAMeeN', function(err, decoded) {			
		if (err) {
			res.json({status:'failure', data:'Failed to authenticate token.'});
		} else {
			if(decoded.usermode){
				res.json({status:'success', data:decoded});
			}else{
				res.json({status:'failure', data:'You are not authorized, not a valid user.'});
			}
		}
	});
});

router.get('/amn', function(req, res, next) {
	res.end('Hello');
});

module.exports = router;