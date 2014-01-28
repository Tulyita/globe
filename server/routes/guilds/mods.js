'use strict';

var _ = require('lodash');

module.exports = {
	get: function(req, res) {
		var mods = _.where(req.guild.members, {mod: true});
		res.apiOut(null, mods);
	}
};