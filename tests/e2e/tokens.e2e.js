'use strict';

var request = require('request');

describe('/tokens', function() {

	describe('jigg login', function(done) {

		beforeEach(function(done) {
			request('https://jiggmin.com/login.php?do=login', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body); // Print the google web page.
					done();
				}
			});
		});

		it('should accept an auth token from jiggmin.com and return a session token', function(done) {
			request('https://jiggmin.com/-who-am-i.php', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body) // Print the google web page.
					done();
				}
			});
		});
	});
});