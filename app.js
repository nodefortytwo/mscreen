
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


//heroku doesn't yet support proper web sockets so we have to use long polling instead
var nowjs = require("now");
var everyone = nowjs.initialize(server, {socketio: {transports: ['xhr-polling', 'jsonp-polling']}});

//nowstuff
var usrCnt = 0;

nowjs.on('connect', function() {
    usrCnt++;
    console.log('User Connected');
    console.log('User Count: ' + usrCnt);
});

nowjs.on('disconnect', function() {
    usrCnt--;
    console.log('User Disconnected');
    console.log('User Count: ' + usrCnt);
});
