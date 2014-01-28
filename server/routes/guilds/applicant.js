'use strict';

module.exports = {


	put: function(req, res) {
		if(String(req.session._id) !== String(req.params.userId)) {
			return res.apiOut('You can not apply for someone else.');
		}
		return req.guild.addUserToList('applicants', req.session._id, function(err) {
			if(err) {
				return res.apiOut(err);
			}

			var user = req.guild.getUserFrom('applicants', req.params.userId);
			return res.apiOut(null, user);
		});
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