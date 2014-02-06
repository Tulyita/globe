'use strict';

var User = require('../models/user');
var _ = require('lodash');

module.exports = function(query, fields) {
	query = query || {};
	fields = fields || User.publicFields;

	if(_.isString(query)) {
		query = {group: query};
	}

	return function(req, res, next) {

		query._id = req.param('userId');

		User.findOne(query, fields, function(err, user) {
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