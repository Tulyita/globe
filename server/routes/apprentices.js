'use strict';

var groups = require('../config/groups');
var User = require('../models/user');

module.exports = {

	get: function(req, res) {
		User.find({group: groups.APPRENTICE}, function(err, mods) {
			res.apiOut(err, mods);
		});
	}
};