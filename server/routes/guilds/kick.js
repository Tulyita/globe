'use strict';

var _ = require('lodash');

module.exports = {


	get: function(req, res) {
		var kick = _.where(req.guild.kicks, {_id: req.params.userId})[0];
		return res.apiOut(null, kick);
	},


	post: function(req, res) {
		return req.guild.addUserToList('kicks', req.params.userId, res.apiOut);
	}
};