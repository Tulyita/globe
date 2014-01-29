'use strict';

module.exports = {


	put: function(req, res) {
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
			return req.guild.acceptApplication(req.params.userId, function(err) {
				if(err) {
					return res.apiOut(err);
				}

				var user = req.guild.getUserFrom('applicants', req.params.userId);
				return res.apiOut(null, user);
			});
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