'use strict';

var _ = require('lodash');

module.exports = {


	put: function(req, res) {
		req.guild.addUserToList('kicks', req.params.userId, function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, req.guild.getUserFrom('kicks', req.params.userId));
		});
	},


	get: function(req, res) {
		var kick = req.guild.getUserFrom('kicks', req.params.userId);
		return res.apiOut(null, kick);
	},


	del: function(req, res) {
		req.guild.removeUserFromList('kicks', req.params.userId, function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, {code: 204, response: ''});
		});
	}
};