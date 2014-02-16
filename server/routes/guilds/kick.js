'use strict';

var _ = require('lodash');
var permissions = require('../../fns/permissions');


module.exports = {


	put: function(req, res) {
		if(!permissions.iCanKick(req.myself, req.user, req.guild)) {
			return res.apiOut('You can not kick this user');
		}

		req.guild.addUserToList('kicks', req.params.userId, function(err) {
			if(err) {
				return res.apiOut(err);
			}

			req.guild.removeMember(req.params.userId, function(err) {
				if(err) {
					return res.apiOut(err);
				}

				return res.apiOut(null, req.guild.getUserFrom('kicks', req.params.userId));
			});
		});
	},


	get: function(req, res) {
		var kick = req.guild.getUserFrom('kicks', req.params.userId);
		return res.apiOut(null, kick);
	},


	del: function(req, res) {
		if(!permissions.iCanDeKick(req.myself, req.user, req.guild)) {
			return res.apiOut('You can not de-kick this user');
		}

		req.guild.removeUserFromList('kicks', req.params.userId, function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, {code: 204, response: ''});
		});
	}
};