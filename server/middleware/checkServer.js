'use strict';

var serverKeys = require('../fns/serverKeys');

module.exports = function(req, res, next) {
	var service = req.param('service');
	var key = req.param('key');
	if (serverKeys(service, key)) {
		return next();
	}
	else {
		return res.apiOut({code: 401, message: 'Server auth failed'}, null);
	}
}