'use strict';

var User = require('../models/user');

module.exports = function(req, res) {

	if(!req.body.userId) {
		return res.apiOut('userId required');
	}

	User.findById(req.body.userId, {bans:true}, res.apiOut);
};