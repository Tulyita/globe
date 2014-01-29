'use strict';

var _ = require('lodash');
var settingFields = ['desc', 'hasBanner', 'join'];

module.exports = {

	post: function(req, res) {
		var guild = req.guild;
		var body = req.body;

		guild.desc = body.desc || guild.desc;
		guild.hasBanner = _.isUndefined(body.hasBanner) ? guild.hasBanner : body.hasBanner;
		guild.join = body.join || guild.join;
		guild.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, _.pick(guild, settingFields));
		});
	},


	get: function(req, res) {
		res.apiOut(null, _.pick(req.guild, settingFields));
	}
};