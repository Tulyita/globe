'use strict';

var Guild = require('../../models/guild');

module.exports = {

	get: function(req, res) {
		Guild.findById(req.params.guildId, 'kicks', function(err, guild) {
			if(err) {
				return res.apiOut(err);
			}
		});
	}
};