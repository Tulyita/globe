'use strict';

var groups = require('../config/groups');

module.exports = {


	put: function(req, res) {
		req.user.group = groups.MOD;
		return req.user.save(function(err) {
			res.apiOut(err, req.user);
		});
	},


	get: function(req, res) {
		return res.apiOut(null, req.user);
	},


	del: function(req, res) {
		req.user.group = groups.USER;
		return req.user.save(function(err) {
			res.apiOut(err, req.user);
		});
	}
};