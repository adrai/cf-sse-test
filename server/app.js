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
      done(null, username === 'user' &&
                 password === 'password');
    }
  ));

  restService.use(restify.authorizationParser());
  restService.use(passport.initialize());
  restService.use(passport.authenticate('basic', { session: false }));
}

restService.get('/event', sse(), function (req, res) {
  var workerId = parseInt(req.header('X-WorkerId'), 10);

  var counter = 0;

  res.json("this is an event");
  console.log('send message... to ' + workerId);
  var inter = setInterval(function() {
    res.json({here: "is", another: "event", number: ++counter, workerId: workerId});
    console.log('send message... to ' + workerId + ' | ' + counter);
  }, 1000);

  req.on('close', function() {
    console.log('closed connection of ' + workerId);
    clearInterval(inter);
  });
});

restService.listen(process.env.PORT || 8080, function () {
  console.log( '%s listening at %s', restService.name, restService.url);
});
