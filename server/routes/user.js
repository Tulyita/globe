'use strict';

var banFns = require('../fns/banFns');
var permissions = require('../fns/permissions');
var Guild = require('../models/guild');


module.exports = {

	get: function(req, res) {

		var me = req.myself;
		var user = req.user;
		var obj = user.publicData();

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

		if(obj.actions.deBan) {
			obj.ban = banFns.findActiveBan(user.bans);
		}

		if(user.guild && user.guild === me.guild) {
			return Guild.findById(user.guild, function(err, guild) {
				if(guild) {
					obj.actions.guildMod = permissions.iCanGuildMod(me, user, guild);
					obj.actions.deGuildMod = permissions.iCanDeGuildMod(me, user, guild);
				}
				res.apiOut(null, obj);
			});
		}

		res.apiOut(null, obj);
	}
};