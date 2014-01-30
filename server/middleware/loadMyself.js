'use strict';

var User = require('../models/user');
var _ = require('lodash');

module.exports = function(req, res, next) {

	User.findById(req.session._id, function(err, user) {
		if(err) {
			return res.apiOut(err);
		}
		if(!user) {
			return res.send(404, 'Your account was not found');
		}

		req.myself = user;
		return next();
	});
};