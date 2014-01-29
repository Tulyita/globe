'use strict';

module.exports = function(req, res, next) {
	if(req.guild.getInvitation(req.params.userId)) {
		return next();
	}
	return res.status(404).send('Invitation not found.');
};
