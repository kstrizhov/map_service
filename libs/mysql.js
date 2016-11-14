var mysql = require('mysql');
var app = require('../app');

function getDataFromDB() {

	var connection = mysql.createConnection({
		connectionLimit : 10,
		host : '',
		user : '',
		password : '',
		database : ''
	});

	connection.connect();

	var query = connection.query("SELECT `lat`, `long`, `type` FROM ");

	query.on('error', function(err) {
		throw err;
	});

	query.on('fields', function(fields) {
		console.log('fields');
	});

	query.on('result', function(row) {
		app.server.emit('new point', {
			lat : row.lat,
			long : row.long,
			type : row.type
		});
	});

	connection.end();
}

module.exports.getData = getDataFromDB;