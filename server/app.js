var restify = require('restify'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    sse = require('connect-sse');

var restService = restify.createServer();

var acceptable = [].concat(restService.acceptable);
acceptable.push('text/event-stream');
restService.use(restify.acceptParser(acceptable));
restService.use(restify.queryParser());
restService.use(restify.bodyParser());

var auth = false;

if (auth) {
  passport.use(new BasicStrategy(
    function(username, password, done) {
      done(null, username === options.credentials.username &&
                 password === options.credentials.password);
    }
  ));

  restService.use(restify.authorizationParser());
  restService.use(passport.initialize());
  restService.use(passport.authenticate('basic', { session: false }));
}

restService.get('/event', sse(), function (req, res) {
  var pidClient = parseInt(req.header('X-PID'), 10);

  var counter = 0;

  res.json("this is an event");
  console.log('send message... to ' + pidClient);
  var inter = setInterval(function() {
    res.json({here: "is", another: "event", number: ++counter, yourPid: pidClient});
    console.log('send message... to ' + pidClient + ' | ' + counter);
  }, 1000);

  req.on('close', function() {
    console.log('closed connection of ' + pidClient);
    clearInterval(inter);
  });
});

restService.listen(process.env.PORT || 8080, function () {
  console.log( '%s listening at %s', restService.name, restService.url);
});
