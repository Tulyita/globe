'use strict';

var User = require('../models/user');
var _ = require('lodash');

module.exports = function(query) {
	query = query || {};

	if(_.isString(query)) {
		query = {group: query};
	}

	return function(req, res, next) {

		query._id = req.params.userId;

		User.findOne(query, User.publicFields, function(err, user) {
			if(err) {
				return res.apiOut(err);
			}
			if(!user) {
				return res.send(404, 'User not found');
			}

			req.user = user;
			return next();
		});

	};
};