/**
 * Module dependencies.
 */
var express = require('express')
  , config = require('./config')
  , db = require('./dao/db')
  , routes = require('./routes')
  , user = require('./routes/user')
  , file = require('./routes/file')
  , mail = require('./routes/mail')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
	app.set('port', config.port);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
//	app.use(express.favicon());
    app.use(express.favicon(__dirname + '/public/favicon.ico', {
        maxAge: 2592000000
    }));
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
app.get('/users', user.list);
app.get('/upload', file.get);
app.post('/upload', file.post);
app.get('/mail', mail.index);


db.connect(function(error){
	if(error) throw error;
	console.log("database connect!");
})

app.on('close', function(error) {
	db.disconnect(function(error){});
	console.log("database connect!");
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
