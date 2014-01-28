'use strict';

module.exports = function(req, res, next) {
	if(!req.guild.isOwner(req.session._id) && req.session._id !== req.params.userId) {
		return res.apiOut('You must be an owner of this guild or the specified member to do this.');
	}
	return next();
};
