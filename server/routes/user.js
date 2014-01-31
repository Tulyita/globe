'use strict';

module.exports = {

	get: function(req, res) {
		return res.apiOut(null, req.user.publicData());
	}
};