'use strict';

var Guild = require('../../models/guild');

module.exports = {
	get: function(req, res) {
		Guild.find({}, res.apiOut);
	}
};