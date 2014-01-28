'use strict';

module.exports = function(req, res, next) {
	if(!req.guild.isOwner(req.session._id) && !req.guild.isGuildMod(req.session._id)) {
		return res.apiOut('You must be a guild owner or guild mod to do this.');
	}
	return next();
};