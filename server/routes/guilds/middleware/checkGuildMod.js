'use strict';

module.exports = function(req, res, next) {
	if(req.guild.getOwner(req.session._id) || req.guild.getGuildMod(req.session._id)) {
		return next();
	}
	return res.apiOut('You must be a guild owner or guild mod to do this.');
};