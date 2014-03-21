'use strict';

var banFns = require('../fns/banFns');
var permissions = require('../fns/permissions');
var Guild = require('../models/guild');
var User = require('../models/user');
var _ = require('lodash');


module.exports = {

	get: function(req, res) {

		var user = req.user;
		var obj = user.publicData();

		// add bans if they were requested
		if(req.param('bans')) {
			obj.bans = _.map(user.bans, function(ban) {
				return _.pick(ban, '_id', 'type', 'mod', 'expireDate', 'date', 'reason', 'publicInfo');
			});
			obj.ban = banFns.findActiveBan(obj.bans);
		}

		// just return the data if you are not logged in
		if(!req.session._id) {
			return(res.apiOut(null, obj));
		}

		// return data + permissions if you are logged in
		User.findById(req.session._id, function(err, me) {
			if(!me) {
				return(res.apiOut(null, obj));
			}

			obj.actions = {
				message: permissions.iCanMessage(me, user),
				apprentice: permissions.iCanApprentice(me, user),
				deApprentice: permissions.iCanDeApprentice(me, user),
				mod: permissions.iCanMod(me, user),
				deMod: permissions.iCanDeMod(me, user),
				ban: permissions.iCanBan(me, user),
				deBan: permissions.iCanDeBan(me, user),
				report: permissions.iCanReport(me, user)
			};

			if(user.guild) {
				return Guild.findById(user.guild, function(err, guild) {
					if(guild) {
						obj.actions.guildMod = permissions.iCanGuildMod(me, user, guild);
						obj.actions.deGuildMod = permissions.iCanDeGuildMod(me, user, guild);
						obj.actions.kick = permissions.iCanKick(me, user, guild);
						obj.actions.deKick = permissions.iCanDeKick(me, user, guild);
					}
					res.apiOut(null, obj);
				});
			}

			res.apiOut(null, obj);
		});
	}
};