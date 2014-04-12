var crypto = require('crypto');
var WebSocket = require('ws');
var prettysize = require('prettysize');

const clients = process.argv[2] ? parseInt(process.argv[2]) : 1;
const msgSize = parseInt(process.argv[3]);
const msgsCount = process.argv[4] ? parseInt(process.argv[4]) : 1; 
var port = 8082

for (var i = 0; i < clients; i++) {
	connect(i);
}

function connect(clientId) {
    var ws = new WebSocket('ws://localhost:' + port);
    var start = Date.now();
    var i = msgsCount;
    ws.on('open', function() {
        uploadStart(msgSize);
    });

    ws.on('message', function(message) {
        if (--i) {
            uploadStart(msgSize);
        } else {
            ws.close();
            var totalTime = Date.now() - start;
            var ave = totalTime / msgsCount;
            console.log('Client '+clientId + ' sent+received: '
                    + prettysize(2*msgSize*msgsCount) + ' in '+totalTime/1000+'sec, '+prettysize(msgSize*2000/ave)+'/sec');
        }
    });

    function uploadStart(size) {
        var buf = crypto.pseudoRandomBytes(size);
        ws.send(buf, { binary : true });
    }
}

