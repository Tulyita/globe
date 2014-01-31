'use strict';

var jiggLogin = require('./jiggLogin');
var request = require('request');

describe('/tokens', function() {

	describe('jigg login', function(done) {

		beforeEach(function(done) {
			jiggLogin(function(err) {
				done(err);
			});
		});

		it('should accept an auth token from jiggmin.com and return a session token', function(done) {
			request('https://jiggmin.com/-who-am-i.php', {jar: true}, function (error, response, body) {
				var data = JSON.parse(body);
				expect(data.logged_in).toBe(true);
				expect(data.token).toBeTruthy();
				done(error);
			});
		});
	});
});