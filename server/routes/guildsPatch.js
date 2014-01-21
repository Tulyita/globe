'use strict';

var Guild = require('../models/guild');


var guildsPatch = function(req, res) {

	var guildId = req.body.guildId;
	var join = req.body.join;

	Guild.findById(guildId, {_id: 1, join: 1, owners: 1}, function(err, guild) {
		if(err) {
			return res.apiOut(err);
		}
		if(!guild) {
			return res.apiOut('Guild not found.');
		}
		if(!guild.isOwner(req.session._id)) {
			return res.apiOut('You are not an owner of this guild.');
		}

		guild.join = join;
		return guild.save(res.apiOut);
	});


};

module.exports = guildsPatch;