var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
var pg = require('libs/pg');
var fs = require('fs');

var app = express();
app.set('port', config.get('port'));

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

var server = http.createServer(app).listen(app.get('port'), function() {
	log.info("Express server is listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

app.get('/data', function(req, res) {
	res.render('main');
});

app.get('/libs/leaflet/leaflet.css', function(req, res) {
	res.sendFile(__dirname + '/libs/leaflet/leaflet.css');
});

app.get('/libs/leaflet/leaflet-src.js', function(req, res) {
	res.sendFile(__dirname + '/libs/leaflet/leaflet-src.js');
});

app.get('/libs/leaflet/images/marker-icon.png', function(req, res) {
	res.sendFile(__dirname + '/libs/leaflet/images/marker-icon.png');
});

app.get('/libs/leaflet/images/marker-shadow.png', function(req, res) {
	res.sendFile(__dirname + '/libs/leaflet/images/marker-shadow.png');
});

app.get('/map/map.js', function(req, res) {
	res.sendFile(__dirname + '/map/map.js');
});

app.get('/rs.png', function(req, res) {
	res.sendFile(__dirname + '/public/images/rs.png');
});

app.get('/getPoints', function(req, res) {
	pg.getData();
	//log.info(data);
});

io.on('connection', function(socket) {
	console.log('user connected');
	socket.emit('connected');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('get points', function(data) {
		pg.getData();
		console.log(data);
	});
	server.on('new point', function(data){
		socket.emit('point from server', data);
	});
	server.on('disc', function(){
		socket.disconnect();
	});
});

module.exports.server = server;
module.exports = app;

//function sendFile(file, res) {
//	//	TODO find out is it really usefull
//	//	example:
//	//	var file = new fs.ReadStream('map/map.js');
//	//	sendFile(file, res);
//
//	file.pipe(res);
//
//	file.on('error', function(err) {
//		res.statusCode = 500;
//		res.end("Server error");
//		console.log(err);
//	});
//
//	res.on('close', function() {
//		file.destroy();
//	});
//}

// app.use(function(req, res) {
// res.end("END");
// });

// app.use(function(req, res) {
// if (req.url == '/data') {
// console.log("qqq");
// var file = new fs.ReadStream('map/main.html');
// sendFile(file, res);
// }
// });

// app.get('/data', function(req, res) {
// console.log('qqq');
// //console.log(req.headers);
// //pg.getData();
// //res.end("Hello!");
// //res.setHeader("Content-Type", "text/html; charset=utf-8");
// //res.sendFile('map/main.html', {root: 'map/main.html'});
// //res.send("Hello!");
// res.render('main');
// log.info("qqq");
// res.end();
// });

// var routes = require('./routes/index');
// var users = require('./routes/users');
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// // uncomment after placing your favicon in /public
// // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// // app.use(logger('dev'));
// // /app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({
// // extended : false
// // }));
// // app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', routes);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
// var err = new Error('Not Found');
// err.status = 404;
// next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
// app.use(function(err, req, res, next) {
// res.status(err.status || 500);
// res.render('error', {
// message : err.message,
// error : err
// });
// });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
// res.status(err.status || 500);
// res.render('error', {
// message : err.message,
// error : {}
// });
// });
//
// module.exports = app;
