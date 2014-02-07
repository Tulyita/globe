'use strict';

var groups = require('../config/groups');

module.exports = function(req, res, next) {
	if (req.session && req.session._id && req.user.group === groups.ADMIN) {
		next();
	}
	else {
		var err = 'Only admins can view this page';
		res.apiOut(err, null);
	}
};