var fs = require('fs');
var https = require('https');
var wsServer = require('ws').Server;
var prettysize = require('prettysize');

var httpServer = https.createServer({
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem')
});
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
