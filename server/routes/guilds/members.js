var Guild = require('../../models/guild');

module.exports = {

	get: function(req, res) {
		Guild.findById(req.param.guildId, res.apiOut);
	}

};