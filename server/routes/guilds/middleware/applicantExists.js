'use strict';

module.exports = function(req, res, next) {
	if(req.guild.getApplicant(req.params.userId)) {
		return next();
	}
	return res.status(404).send('Applicant not found.');
};
