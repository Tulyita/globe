'use strict';

module.exports = function(req, res, next) {
	if(req.guild.getMod(req.params.userId)) {
		return next();
	}
	return res.status(404).send('Mod not found');
};
