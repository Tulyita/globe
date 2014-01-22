'use strict';

var _ = require('lodash');
var Guild = require('../models/guild');

var fns = {

	post: function(req, res) {
		var action = req.body.action || 'create';
		return fns.performAction(action, req.body, req.session, res.apiOut);
	},


	allowedAction: function(action) {
		return ['createGuild', 'updateGuild', 'addJoinRequest', 'removeJoinRequest', 'acceptJoinRequest', 'addInvitation', 'removeInvitation'].indexOf(action) !== -1;
	},


	performAction: function(action, data, session, callback) {
		if(!fns.allowedAction(action)) {
			return callback('Invalid action');
		}

		return Guild.findById(data.guildId, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild && action !== 'createGuild') {
				return callback('Guild not found.');
			}

			var fn = fns[action];
			return fn(guild, data, session, callback);
		});
	},


	createGuild: function(existingGuild, data, session, callback) {
		if(existingGuild) {
			return callback('This guild name already exists.');
		}
		var guild = {_id: data.guildId};
		guild.owners = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members[0].mod = true;
		return Guild.create(guild, callback);
	},


	updateGuild: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}
		guild.join = data.join;
		return guild.save(callback);
	},


	addJoinRequest: function(guild, data, session, callback) {
		return guild.addJoinRequest(session, callback);
	},


	removeJoinRequest: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}
		return guild.removeJoinRequest({_id: data.userId}, callback);
	},


	acceptJoinRequest: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}
		return guild.removeJoinRequest({_id: data.userId}, function(err) {
			if(err) {
				return callback(err);
			}
			return guild.addMember(data.userId, callback);
		});
	},


	addInvitation: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}
		return guild.addInvitation({_id: data.userId}, callback);
	},


	removeInvitation: function(guild, data, session, callback) {
		return guild.removeInvitation(session, callback);
	},


	acceptInvitation: function(guild, data, session, callback) {
		return guild.removeInvitation(session, function(err) {
			if(err) {
				return callback(err);
			}
			return guild.addMember(session._id, callback);
		});
	},


	deleteGuild: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}
		return guild.removeAllMembers(function(err) {
			if(err) {
				return callback(err);
			}

			return guild.remove(callback);
		});
	}
};

module.exports = fns;