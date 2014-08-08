var EventSource = require('eventsource');

var serverUrl = 'http://localhost:8080';

if (process.env.PORT) {
  serverUrl = 'http://test-sse-server.beta.scapp.io';
}

var auth = false;

var es = new EventSource(serverUrl + '/event', {
  headers: {
    'authorization': auth ? 'Basic ' + new Buffer('user'+ ':' + 'password').toString('base64') : undefined
  }
});
es.onmessage = function(e) {
  console.log(e.data);
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