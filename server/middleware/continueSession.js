(function() {
	'use strict';

	var session = require('../fns/redisSession');


	module.exports = function(req, res, next) {

		req.session = req.session || {};
		var token = req.headers['session-token'] || req.body.token;

		if(!token) {
			return next();
		}

		session.get(token, function(err, result) {
			if(err) {
				return res.apiOut(err);
			}
			if(result && result.bannedUntil > new Date()) {
				return res.apiOut('This account is banned until ' + result.bannedUntil);
			}
			req.session = result || {};

			return next();
		});
	};

}());