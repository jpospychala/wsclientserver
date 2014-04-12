var wsServer = require('ws').Server;
var httpServer = require('http').createServer();
var prettysize = require('prettysize');
httpServer.listen(8082);

var ws = new wsServer({server: httpServer});

var clientsCount = 0;
var bytesSent = 0;

ws.on('connection', function(connection) {
  clientsCount++;
  connection.on('message', function(message) {
    bytesSent += message.length;
    connection.send(message, {binary: true});
  });
  connection.on('close', function() {
	  clientsCount--;
  })
});

forever(logStatus);

function logStatus() {
	console.log('clients: '+clientsCount+', sent: '+prettysize(bytesSent));
}

function forever(func) {
	func();
	setTimeout(function() {
		forever(func);
	}, 1000)
}