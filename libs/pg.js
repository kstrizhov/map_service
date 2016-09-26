var pg = require('pg');
var app = require('app');

var conString = "postgres://kirill:qqq@localhost/address_db";

// this initializes a connection pool
// it will keep idle connections open for a (configurable) 30 seconds
// and set a limit of 20 (also configurable)
function getDataFromDB() {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		var query = client.query('SELECT * FROM yashin', function(err,
				result) {
			// call `done()` to release the client back to the pool
			done();

			if (err) {
				return console.error('error running query', err);
			}
		});
		var i = 0;
		query.on('row', function(row) {
			if (i < 10000) {
				app.server.emit('new point', {
					lat : row.lat,
					lng : row.lng,
					type : row.type
				});
				i++;
			} else {
				app.server.emit('disc');
			}
		});
	});
}

module.exports.getData = getDataFromDB;
