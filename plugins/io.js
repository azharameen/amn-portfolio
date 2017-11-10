/* load database module */
var db = require('./db.js');

var clients=[];

module.exports = function (io) {

	io.on('connection', function(client) {
		clients.push(client.id);
		console.log(client.decoded_token.usermode + ' -> connected');	

		client.join(client.decoded_token.usermode);

		client.to('AMNliveFeed').emit('connected_clients', clients);

		client
		.to('AMNliveFeed')
		.on('list_of_users', function () {
			client.to('AMNliveFeed').emit('connected_clients', clients);
		});


		client
		.to(client.decoded_token.usermode)

		.on('insert', function (callback, table, data) {
			var query = db.query('INSERT INTO '+ table +' SET ?', data, function (err, rows, fields) {
				if (err) {
					response('failure', err, callback);
					return;
				}
				response('success', rows, callback);
			});
			// console.log('insert -> '+query.sql);
		})

		.on('update', function (callback, table, data, where) {
			if(where) {
				where = " where 1=1 and "+where;
			}else{
				where = " where 1=1 ";
			}
			var query = db.query('UPDATE '+ table +' SET ? where 1=1', data, function (err, rows, fields) {
				if (err) {
					response('failure', err, callback);
					return;
				}
				response('success', rows, callback);
			});
			// console.log('data -> '+query.sql);
		})

		.on('fetch', function (callback, select, table, where) {
			if(where) {
				where = " where 1=1 and "+where;
			}else{
				where = " where 1=1 ";
			}
			var query = db.query('select '+ select +' from '+ table +where, function (err, rows, fields) {
				if (err) {
					response('failure', err, callback);
					return;
				}
				response('success', rows, callback);
			});
			// console.log('fetch -> '+query.sql);
		})

		.on('send-feed', function (key, feed) {
			var query = db.query('INSERT INTO `livefeed` (`project`, `key`, `data`) VALUES ("'+ client.decoded_token.usermode +'", "'+client.decoded_token.usermode+'_'+key+'", "'+ feed +'") ON DUPLICATE KEY UPDATE `data`="'+feed+'"', function (err, rows, fields) {
				if (err) {
					response('failure', err, 'receive-feed');
					return;
				}
				var query1 = db.query('select `data` from `livefeed` where `project`="'+ client.decoded_token.usermode +'"', function (err, rows, fields) {
					if (err) {
						response('failure', err, 'receive-feed');
						return;
					}
					response('success', rows, 'receive-feed');
				});
			});
		})

		.on('broadcast', function (data) {
			io.sockets.emit('casts', data);
		})

		.on('send-msg', function (key, data) {
			io.sockets.connected[key].emit('receive-msg', data);
		})

		.on('disconnect', function (data) {
			// delete client.decoded_token.usermode;
			clients.splice(clients.indexOf(client.id), 1);
			console.log('--> disconnected '+data);
			client.to('su').emit('connected_clients', clients);
		});

		function response(status, data, callback) {
			if(status && data && callback){
				io.to(client.decoded_token.usermode).emit(callback, {
					status : status,
					data : data
				});
			}
		}
	});
}