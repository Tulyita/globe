'use strict';

var groups = require('../config/groups');

module.exports = function(req, res, next) {
	var session = req.session;
	if (session && session._id && (session.group === groups.MOD || session.group === groups.ADMIN)) {
		next();
	}
	else {
		var err = 'Only mods and admins use this resource';
		res.apiOut(err, null);
	}
};