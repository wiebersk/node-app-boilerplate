
/**
 * Module dependencies.
 */

var express = require('express'),
  https = require('https'),
  fs = require('fs'),
  routes = require('./routes'),
  path = require('path'),
  io  = exports.io= require('socket.io'),
  passport = exports.passport = require('passport'),
  nconf = exports.nconf = require('nconf'),
  winston = exports.winston = require('winston'),
  auth = require('./utils/auth.js');

nconf.argv().env().file({file:'config.json'});

auth.init();

var app = express();

var options = {
  key: fs.readFileSync('./server-key.pem'),
  cert: fs.readFileSync('./server-cert.pem')
};

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(passport.initialize());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = exports.server = https.createServer(options,app).listen(app.get('port'), function(){
  winston.info("Express server listening on port " + app.get('port'));
});

io.listen(server);
