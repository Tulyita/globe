'use strict';

var _ = require('lodash');

module.exports = {


	post: function(req, res) {
		var guild = req.guild;
		var body = req.body;

		guild.desc = body.desc || guild.desc;
		guild.hasBanner = body.hasBanner || guild.hasBanner;
		guild.join = body.join || guild.join;
		guild.save(res.apiOut);
	},


	get: function(req, res) {
		res.apiOut(null, _.pick(req.guild, 'desc', 'hasBanner', 'join'));
	}
};