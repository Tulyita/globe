'use strict';

var _ = require('lodash');
var Guild = require('../models/guild');

var guildFns = {

	post: function(req, res) {
		guildFns.createGuild(req.body, req.session, res.apiOut);
	},


	createGuild: function(data, session, callback) {
		var guild = {_id: data.guildId};
		guild.owners = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members[0].mod = true;
		Guild.create(guild, callback);
	}

	/*deleteGuild: function(guildId, session, callback) {
		Guild.findById(guildId, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guildFns.isOwner(guild, session)) {
				return callback('You do not own this guild.');
			}
			return guild.remove(callback);
		});
	},

	joinGuild: function(guildId, userId) {

	},

	leaveGuild: function(guildId, userId) {

	},
*/
};

module.exports = guildFns;