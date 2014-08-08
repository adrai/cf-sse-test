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
  var counter = 0;

  req.on('close', function() {
    console.log('closed connection');
  });

  res.json("this is an event");
  console.log('send message...');
  setInterval(function() {
    res.json({here: "is", another: "event", number: ++counter});
    console.log('send message... ' + counter);
  }, 1000);
});

restService.listen(process.env.PORT || 8080, function () {
  console.log( '%s listening at %s', restService.name, restService.url);
});
