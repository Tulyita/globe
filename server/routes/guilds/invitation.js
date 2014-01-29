'use strict';

module.exports = {


	put: function(req, res) {
		return req.guild.addUserToList('invitations', req.params.userId, function(err) {
			return res.apiOut(err, req.guild.getUserFrom('invitations', req.params.userId));
		});
	},


	post: function(req, res) {
		var action = req.query.action || 'create';

		if(action === 'accept') {
			return req.guild.acceptInvitation(req.params.userId, function(err) {
				return res.apiOut(err, req.guild.getUserFrom('invitations', req.params.userId));
			});
		}

		return res.apiOut('Action not found.');
	},


	get: function(req, res) {
		return res.apiOut(null, req.guild.getUserFrom('invitations', req.params.userId));
	},


	del: function(req, res) {
		return req.guild.removeUserFromList('invitations', req.params.userId, function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.status(204).send();
		});
	}
};