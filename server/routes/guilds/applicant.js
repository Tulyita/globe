'use strict';

module.exports = {


	put: function(req, res) {
		return req.guild.addUserToList('applicants', req.session._id, res.apiOut);
	},


	post: function(req, res) {
		if(req.query.action === 'accept') {
			if(!req.guild.isOwner(req.session._id)) {
				return res.apiOut('You must be the owner of this guild to accept a join request.');
			}
			return req.guild.acceptJoinRequest(req.params.userId, res.apiOut);
		}

		return res.apiOut('Invalid action.');
	},


	get: function(req, res) {
		return res.apiOut(null, _.where(req.guild.applicants, {_id: req.params.userId}));
	},


	del: function(req, res) {
		return req.guild.removeUserFromList('applicants', req.params.userId, res.apiOut);
	}
};