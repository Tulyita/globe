'use strict';

module.exports = function(req, res, next) {
	if(req.session._id === req.params.userId) {
		return next();
	}
	return res.apiOut('You can not do this for another member');
};
