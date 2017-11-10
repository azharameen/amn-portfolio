/*
*	Client connection
*	Developed By 'M.A. AZHAR AMEEN'
*
*/


var spot = io.connect('http://192.168.1.101:3000/', {
	'query' : 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQU1ObGl2ZUZlZWQiLCJwYXRoIjoiQU1ObGl2ZUZlZWQiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJ0YWJsZSI6ImxpdmVfZmVlZHMiLCJpYXQiOjE1MTAwNTE5MDh9.b44PdWexw2xpWePdf0aLY5nZuunyGFRsuSdxz4rp1X8'
});

console.log("Got Ready...");
setTimeout(function() {
	spot.emit('list_of_users');
}, 100);

spot.on('connected_clients', function (data1) {
	var content="";
	if(data1.length > 0){
		data1.forEach(function (data) {
			content += `<li><a href="javascript:void(0)" onclick="send_Message('`+data+`')">`+data+`</a></li>`;
		});
		document.getElementById('cont_users').innerHTML = data1.length;
		document.getElementById('conn_users').innerHTML = content;
	}
});

spot.on('result', function (data1) {
	console.log(data1);
});

spot.on('receive-feed', function (data1) {
	console.log(data1);
});

spot.on('tableView', function (data1) {
	var content = "";
	data1.data.forEach(function (data) {
		content += `<tr><td>`+data.id+`</td><td>`+data.lat+`</td><td>`+data.lng+`</td></tr>`;
	});
	document.getElementById('tableBody').innerHTML = content;
});


spot.on('casts', function (data1) {
	console.log(data1);
});


function send_Message(key){
	spot.emit('send-msg', key, 'data got back to user '+ key);
}

spot.on('receive-msg', function (data1) {
	console.log(data1);
});

spot.on("error", function(error, callback) {
	if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
		// redirect user to login page perhaps or execute callback:
		console.log("User's token has expired");
	}
});


// setTimeout(function() {

// 	spot.emit('insert', 'result', 'feeds', {lat:'4.655656', lng:'52.323232'});
// 	spot.emit('update', 'result', 'feeds', {lat:'4', lng:'52'});
// 	spot.emit('fetch', 'tableView', '*', 'feeds');
// 	spot.emit('send-feed', 'result', 'This is live feeds');
// 	spot.emit('broadcast', 'This is a simple hi message');
	
// }, 3000);
