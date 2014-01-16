(function() {
	'use strict';

	var UserGoose = require('../models/user');


	/**
	 * Return the user associated with an existing session
	 */
	module.exports = function(req, res) {
		UserGoose.findById(req.session._id, function(err, user) {
			if(err) {
				return res.apiOut(err);
			}
			if(!user) {
				return res.apiOut({code: 200, message: 'no user found with that token'});
			}
			return res.apiOut(null, user);
		});
	};

}());