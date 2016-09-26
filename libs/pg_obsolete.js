var pg = require('pg');

var conString = "postgres://kirill:qqq@localhost/address_db";

// this initializes a connection pool
// it will keep idle connections open for a (configurable) 30 seconds
// and set a limit of 20 (also configurable)
function getDataFromDB() {

	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		client.query('SELECT * FROM points', function(err, result) {
			// call `done()` to release the client back to the pool
			done();

			if (err) {
				return console.error('error running query', err);
			}
			console.log("json data from pg 1: " + json);
			// console.log(result.rows[0].number);
			// output: 1
		});
		console.log("json data from pg 2: " + json);
	});
}

module.exports.getData = getDataFromDB;
