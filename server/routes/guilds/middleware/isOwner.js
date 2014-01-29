'use strict';

module.exports = function(req, res, next) {
	if(req.guild.getOwner(req.session._id)) {
		return next();
	}
	return res.apiOut('You must be an owner of this guild to do this');
};
