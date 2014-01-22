'use strict';

var _ = require('lodash');
var Guild = require('../models/guild');

var guildFns = {

	post: function(req, res) {
		var action = req.body.action || 'create';

		var allowedActions = ['createGuild', 'updateGuild', 'addJoinRequest', 'removeJoinRequest', 'addInvitation', 'removeInvitation'];
		if(allowedActions.indexOf(action) === -1) {
			return res.apiOut('Invalid action');
		}

		var fn = guildFns[action];
		return fn(req.body, req.session, req.apiOut);
	},


	createGuild: function(data, session, callback) {
		var guild = {_id: data.guildId};
		guild.owners = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members[0].mod = true;
		Guild.create(guild, callback);
	},


	updateGuild: function(data, session, callback) {
		var guildId = data.guildId;
		var join = data.join;

		Guild.findById(guildId, {_id: 1, join: 1, owners: 1}, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild) {
				return callback('Guild not found.');
			}
			if(!guild.isOwner(session._id)) {
				return callback('You are not an owner of this guild.');
			}

			guild.join = join;
			return guild.save(callback);
		});
	},


	addJoinRequest: function(data, session, callback) {
		Guild.findById(data.guildId, {_id: 1, join: 1, joinRequests: 1}, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild) {
				return callback('Guild not found.');
			}
			return guild.addJoinRequest(session, callback);
		});
	},


	removeJoinRequest: function(data, session, callback) {
		Guild.findById(data.guildId, {_id: 1, join: 1, joinRequests: 1}, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild) {
				return callback('Guild not found.');
			}
			return guild.removeJoinRequest(session, callback);
		});
	},


	addInvitation: function(data, session, callback) {
		Guild.findById(data.guildId, {_id: 1, join: 1, invitations: 1}, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild) {
				return callback('Guild not found.');
			}
			return guild.addInvitation(session, callback);
		});
	},


	removeInvitation: function(data, session, callback) {
		Guild.findById(data.guildId, {_id: 1, join: 1, invitations: 1}, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild) {
				return callback('Guild not found.');
			}
			return guild.removeInvitation(session, callback);
		});
	},


	acceptInvitation: function(data, session, callback) {
		Guild.findById(data.guildId, {_id: 1, join: 1, invitations: 1, members: 1}, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild) {
				return callback('Guild not found.');
			}

			return guild.removeInvitation(session, function(err) {
				if(err) {
					return callback(err);
				}
				return guild.addMember(session._id, callback);
			});
		});
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