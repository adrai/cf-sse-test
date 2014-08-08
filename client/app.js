var EventSource = require('eventsource'),
    assert = require('assert');

var serverUrl = 'http://localhost:8080';

if (process.env.PORT) {
  serverUrl = 'http://test-sse-server.beta.scapp.io';
}

var workerId = Math.floor(Math.random()*10000);

var auth = false;

var es = new EventSource(serverUrl + '/event', {
  headers: {
    'X-WorkerId': workerId,
    'authorization': auth ? 'Basic ' + new Buffer('user'+ ':' + 'password').toString('base64') : undefined
  }
});
es.onmessage = function(e) {
  console.log(workerId, e.data);
  try {
    var json = JSON.parse(e.data);
    if (json.workerId) {
      try {
        assert.equal(json.workerId, workerId);
      } catch(err) {
        console.log('!!!!!scalability missmatch!!!!!!');
      }
    }
  } catch(err) {}
  // es.close();
};
es.onerror = function() {
  console.log('ERROR!');
};

if (process.env.PORT) {
  var http = require('http');
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Just for CF! ;-)\n');
  }).listen(process.env.PORT);
}