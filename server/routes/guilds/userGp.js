'use strict';

var _ = require('lodash');


module.exports = {


	post: function(req, res) {
		req.guild.incGp(req.params.userId, req.query.inc, function(err) {
			if(err) {
				return res.apiOut(err);
			}

			var user = req.guild.getMember(req.params.userId);
			return res.apiOut(null, _.pick(user, 'gpDay', 'gpWeek', 'gpLife'));
		});
	},


	get: function(req, res) {
		var user = req.guild.getMember(req.params.userId);
		return res.apiOut(null, _.pick(user, 'gpDay', 'gpWeek', 'gpLife'));
	}
};