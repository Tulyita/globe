(function() {
	'use strict';

	var session = require('../../fns/redisSession');


	/**
	 * Delete an existing session
	 */
	module.exports = function(req, res) {

		if(!req.session._id || !req.body.token) {
			return res.apiOut('No token to delete', null);
		}

		var token = req.body.token;
		session.destroy(token, res.apiOut);
	};

}());