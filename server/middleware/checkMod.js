'use strict';

var groups = require('../config/groups');

module.exports = function(req, res, next) {
	var session = req.session;
	if (session && session._id && (session.group === groups.MOD || session.group === groups.ADMIN)) {
		next();
	}
	else {
		var err = {code: 403, message: 'Only mods and admins can use this resource'};
		res.apiOut(err, null);
	}
};