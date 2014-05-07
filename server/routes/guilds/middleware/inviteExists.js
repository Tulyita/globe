'use strict';

module.exports = function(req, res, next) {
	if(req.guild.getInvite(req.params.userId)) {
		return next();
	}
	return res.status(404).send('Invite not found');
};
