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

var server = http.createServer(app).listen(app.get('port'), function() {
	log.info("Express server is listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

app.get('/main', function(req, res) {
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
