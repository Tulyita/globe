'use strict';

var User = require('../models/user');


var messages = {

	get: function(req, res) {

		User.findById(req.session._id, {messages: 1}, {}, function(err, user) {
			if(err) {
				return res.apiOut(err);
			}
			if(!user) {
				return res.apiOut('User not found.');
			}
			return res.apiOut(null, user.messages);
		});
	}

};

module.exports = messages;