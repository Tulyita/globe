'use strict';

var groups = require('../config/groups');

module.exports = function(req, res, next) {
	if (req.session && req.session._id && (req.user.group === groups.MOD || req.user.group === groups.ADMIN)) {
		next();
	}
	else {
		var err = 'Only mods and admins view this page';
		res.apiOut(err, null);
	}
};