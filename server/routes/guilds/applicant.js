'use strict';


module.exports = {


	put: function(req, res) {
		return req.guild.addUserToList('applicants', req.session._id, function(err) {
			return res.apiOut(err, req.guild.getUserFrom('applicants', req.params.userId));
		});
	},


	post: function(req, res) {
		if(req.query.action === 'accept') {

			return req.guild.acceptApplication(req.params.userId, function(err) {
				if(err) {
					return res.apiOut(err);
				}

				return res.apiOut(null, req.guild.getUserFrom('members', req.params.userId));
			});
		}

		return res.apiOut('Invalid action.');
	},


	get: function(req, res) {
		var user = req.guild.getUserFrom('applicants', req.params.userId);
		return res.apiOut(null, user);
	},


	del: function(req, res) {
		return req.guild.removeUserFromList('applicants', req.params.userId, function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.status(204).send();
		});
	}
};