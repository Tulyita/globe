(function() {
	'use strict';

	var UserGoose = require('../models/user');

	/**
	 * Return the user associated with an existing session
	 */
	module.exports = {

		get: function(req, res) {

			var userId = req.param('userId') || req.session._id;

			if(!userId) {
				return res.apiOut('No userId provided');
			}

			return UserGoose.findById(userId, function(err, user) {
				if(err) {
					return res.apiOut(err);
				}
				if(!user) {
					return res.apiOut({code: 200, message: 'no user found with user id "'+userId+'".'});
				}
				return res.apiOut(null, user);
			});
		}
	};


}());