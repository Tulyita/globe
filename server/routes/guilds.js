'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Guild = require('../models/guild');
var isName = require('../validators/isName');
var Groups = require('../config/groups');

var fns = {


	get: function(req, res) {
		return Guild.findById(req.body.guildId, {}, res.apiOut);
	},


	post: function(req, res) {
		var action = req.body.action;
		actions.doAction(action, req.body, req.session, res.apiOut);
	}

};


var actions = {


	doAction: function(action, data, session, callback) {
		var actionFn;

		if(action === 'createGuild') {
			actionFn = actions.createGuild;
		}
		else if(action === 'updateGuild') {
			actionFn = actions.updateGuild;
		}
		else if(action === 'deleteGuild') {
			actionFn = actions.deleteGuild;
		}
		else if(action === 'addJoinRequest') {
			actionFn = actions.addJoinRequest;
		}
		else if(action === 'removeJoinRequest') {
			actionFn = actions.removeJoinRequest;
		}
		else if(action === 'acceptJoinRequest') {
			actionFn = actions.acceptJoinRequest;
		}
		else if(action === 'addInvitation') {
			actionFn = actions.addInvitation;
		}
		else if(action === 'removeInvitation') {
			actionFn = actions.removeInvitation;
		}
		else if(action === 'setMod') {
			actionFn = actions.setMod;
		}

		if(!actionFn) {
			return callback('Action "'+action+'" not found.');
		}

		// static methods
		if(action === 'createGuild' || action === 'incGp') {
			return actionFn(data, session, callback);
		}

		// instance methods
		else {
			return Guild.findById(guildId, function(err, guild) {
				if(err) {
					return callback(err);
				}
				if(!guild) {
					return callback('Guild "'+guildId+'" not found.');
				}



				return actionFn(guild, data, session, callback);
			});
		}
	},


	createGuild: function(data, session, callback) {
		if(session.group === Groups.GUEST) {
			return callback('Guest accounts can not create guilds.');
		}
		var guild = {_id: data.guildId};
		guild.owners = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members = [_.pick(session, '_id', 'name', 'site', 'group')];
		guild.members[0].mod = true;
		return Guild.create(guild, callback);
	},


	incGp: function(data, session, callback) {
		Guild.incGp(data.guildId, data.userId, callback);
	},


	setMod: function(guild, data, session, callback) {
		var userId = data.userId;
		var mod = data.mod;

		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}

		var member = guild.getMember(userId);
		if(!member) {
			return callback('Member "'+userId+'" not found.');
		}

		member.mod = mod;

		return guild.save(callback);
	},


	updateGuild: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}

		guild.join = data.join || guild.join;
		guild.desc = data.desc || guild.desc;

		return guild.save(callback);
	},


	addJoinRequest: function(guild, data, session, callback) {
		return guild.addUserToList('joinRequests', session._id, callback);
	},


	removeJoinRequest: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}

		return guild.removeUserFromList('joinRequests', data.userId, callback);
	},


	acceptJoinRequest: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}

		return guild.acceptJoinRequest(data.userId, callback);
	},


	addInvitation: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id)) {
			return callback('You are not an owner of this guild.');
		}

		return guild.addInvitation(data.userId, callback);
	},


	removeInvitation: function(guild, data, session, callback) {
		if(!guild.isOwner(session._id) && data.userId != session._id) {
			return callback('You are not an owner of this guild.');
		}

		return guild.removeInvitation(data.userId, callback);
	},


	acceptInvitation: function(guild, data, session, callback) {
		return guild.acceptInvitation(session._id, callback);
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