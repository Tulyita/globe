'use strict';

module.exports = function(req, res, next) {
	if(req.guild.getMember(req.params.userId)) {
		return next();
	}
	return res.status(404).send('Member not found');
};
