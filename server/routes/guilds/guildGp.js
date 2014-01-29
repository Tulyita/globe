'use strict';

var _ = require('lodash');


module.exports = {


	post: function(req, res) {
		req.guild.gp += req.query.inc;
		req.guild.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, _.pick(req.guild, 'gp', 'gpDay', 'gpWeek', 'gpLife'));
		});
	},


	get: function(req, res) {
		return res.apiOut(null, _.pick(req.guild, 'gp', 'gpDay', 'gpWeek', 'gpLife'));
	}
};