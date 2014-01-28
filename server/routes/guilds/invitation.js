'use strict';

var _ = require('lodash');


module.exports = {


	put: function(req, res) {
		return req.guild.addInvitation(req.params.userId, res.apiOut);
	},


	post: function(req, res) {
		var action = req.query.action || 'create';

		if(action === 'accept') {
			return req.guild.acceptInvitation(req.session._id, callback);
		}

		return res.apiOut('Action not found.');
	},


	get: function(req, res) {
		return res.apiOut(null, _.where(req.guild.invitations, {_id: req.params.userId})[0]);
	},


	del: function(req, res) {
		return req.guild.removeInvitation(req.params.userId, res.apiOut);
	}
};