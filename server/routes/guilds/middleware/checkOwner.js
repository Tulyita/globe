'use strict';

module.exports = function(req, res, next) {
	if(!req.guild.isOwner(req.session._id)) {
		return res.apiOut('You must be an owner of this guild to do this.');
	}
	return next();
};
