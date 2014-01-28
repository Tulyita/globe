'use strict';

var Guild = require('../../../models/guild');

module.exports = function(req, res, next) {
	Guild.findById(req.params.guildId, function(err, guild) {
		if(err) {
			return res.apiOut(err);
		}
		if(!guild) {
			return res.status(404).send('Guild not found');
		}

		req.guild = guild;
		return next();
	});
};
