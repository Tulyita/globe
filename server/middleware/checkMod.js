(function() {
	'use strict';

	var groups = require('../fns/groups');

	module.exports = function(req, res, next) {
		if (!req.session || !req.session._id || req.session.group !== groups.MOD) {
			var err = {code: 401, message: 'You are not authorized to view this page'};
			res.apiOut(err, null);
		}
		else {
			next();
		}
	};

}());
