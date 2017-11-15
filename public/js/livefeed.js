var base_url = 'http://192.168.1.101:8080/';

var imported = document.createElement('script');
imported.src = '/socket.io/socket.io.js';
imported.onerror = function () {
	console.error('Error on loading LiveFeed...');
};
imported.onload = function () {
	console.info('LiveFeed loaded successfully...');
};
document.head.appendChild(imported);

function LiveFeed(token) {

	this.listen = io.connect(base_url, {
		'query' : 'token='+token
	});

	this.livefeed = function(data) {
		console.info('LiveFeed Message');
		if(data){
			this.listen.emit('livefeed', data)
		}else{
			console.error('invalid parameter set on `livefeed`');
		}
	};
		this.listen.on('livefeed_cb', function (data) {
			this.livefeed_cb = data;
		});

	this.insert = function(callback, table, data) {
		console.info('LiveFeed Message');
		if(callback && table && data){
			this.listen.emit('insert', callback, table, data)
		}else{
			console.error('invalid parameters set on `insert`');
		}
	};

	this.update = function(callback, table, data, where) {
		console.info('LiveFeed Message');
		if(callback && table && data){
			this.listen.emit('update', callback, table, data, where)
		}else{
			console.error('invalid parameters set on `update`');
		}
	};

	this.fetch = function(callback, select, table, where) {
		console.info('LiveFeed Message');
		if(callback && select && table){
			this.listen.emit('fetch', callback, select, table, where)
		}else{
			console.error('invalid parameters set on `fetch`');
		}
	};

	this.send_msg = function(key, data) {
		console.info('LiveFeed Message');
		if(key && data){
			this.listen.emit('send_msg', key, data);
		}else{
			console.error('invalid parameters set on `send_msg`');
		}
	};

		this.listen.on('receive_msg', function (data) {
			this.receive_msg = data;
		});

	this.send_feed = function(key, feed) {
		if(key && feed){
			this.listen.emit('send_feed', key, feed);
		}else{
			console.error('invalid parameters set on `send_feed`');
		}
	};

		this.listen.on('receive_feed', function (data) {
			this.receive_feed = data;
		});

	this.broadcast = function(data) {
		this.listen.emit('broadcast', data);
	};

		this.listen.on('broadcast_cb', function (data) {
			this.broadcast_cb = data;
		});

	this.listen.on("error", function(error, callback) {
		console.error("Error: ", error);
	});

	// Function.prototype.listen = this.listen;
}

window.onload = function() {

	var amn = new LiveFeed('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmV0dXJuIExvZ2lzdGljcyIsInBhdGgiOiJSZXR1cm5fTG9naXN0aWNzIiwidXJsIjoiaHR0cDovL2xvY2FsaG9zdC90ZW1wL3RyYW5zL2lvLmh0bWwiLCJ0YWJsZSI6InJsIiwiaWF0IjoxNTEwMDQ5MTg4fQ.KuB9EdHCOGVScEQ4EiQca8qQdP7QA1Q0vQIOIN45-Kk');

	amn.livefeed('Hello from the broadcast');
	amn.listen.on('livefeed_cb', function (data) {
		console.log('called that mode worked', data);
	});
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQU1ObGl2ZUZlZWQiLCJwYXRoIjoiQU1ObGl2ZUZlZWQiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJ0YWJsZSI6ImxpdmVfZmVlZHMiLCJpYXQiOjE1MTAwNTE5MDh9.b44PdWexw2xpWePdf0aLY5nZuunyGFRsuSdxz4rp1X8