'use strict';

var isName = require('../validators/isName');
var Guild = require('../models/guild');

var guildsGet = function(req, res) {
	if(!isName(req.body.guildId)) {
		return res.apiOut('Invalid guildId');
	}
	return Guild.findById(req.body.guildId, {}, res.apiOut);
};

module.exports = guildsGet;