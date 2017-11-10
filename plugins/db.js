var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'anps'
});

connection.connect(function (err) {
	if (err){
		console.log(err);
	}else{
		console.log('db connection established');
	}
});
module.exports = connection;