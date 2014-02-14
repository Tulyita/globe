'use strict';

var groups = require('../config/groups');

module.exports = {


	put: function(req, res) {
		req.user.group = groups.MOD;
		return req.user.save(function(err) {
			res.apiOut(err, req.user.publicData());
		});
	},


	get: function(req, res) {
		return res.apiOut(null, req.user.publicData());
	},


	del: function(req, res) {
		req.user.group = groups.USER;
		return req.user.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.send(204, '');
		});
	}
};