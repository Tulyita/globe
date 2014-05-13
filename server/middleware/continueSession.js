'use strict';

var session = require('../fns/redisSession');


module.exports = function(req, res, next) {

	req.session = req.session || {};
	var token = req.headers['session-token'] || req.params.token;

	if(!token) {
		return next();
	}

	return session.get(token, function(err, result) {
		if(err) {
			return next();
		}
		if(result && result.bannedUntil > new Date()) {
			return res.apiOut('This account is banned until ' + result.bannedUntil);
		}

		req.session = result || {};

		return next();
	});
};