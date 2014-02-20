'use strict';

var serverKeys = require('../fns/serverKeys');

module.exports = function(req, res, next) {
	var app = req.param('app');
	var key = req.param('key');
	if (serverKeys(app, key)) {
		return next();
	}
	else {
		return res.apiOut({code: 401, message: 'Server auth failed'}, null);
	}
};