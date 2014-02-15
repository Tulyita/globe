'use strict';

var banFns = require('./banFns');
var groups = require('../config/groups');


var check = {
	inSameGuild: function(user1, user2) {
		return user1.guild === user2.guild;
	},
	isSameUser: function(user1, user2) {
		return String(user1._id) === String(user2._id);
	},
	isOwner: function(user, guild) {
		return !!guild.getOwner(user._id);
	},
	isGuildMod: function(user, guild) {
		return !!guild.getGuildMod(user._id) || !!guild.getOwner(user._id);
	},
	isKicked: function(user, guild) {
		return !!guild.getKick(user._id);
	}
};


module.exports = {

	iCanMessage: function(me, user) {
		var silenced = me.silencedUntil || 0;
		var banned = me.bannedUntil || 0;
		var date = new Date();
		return silenced < date && banned < date && me.group !== groups.GUEST && String(user._id) !== String(me._id);
	},

	iCanApprentice: function(me, user) {
		return (me.group === groups.MOD || me.group === groups.ADMIN) && user.group === groups.USER;
	},

	iCanDeApprentice: function(me, user) {
		return (me.group === groups.MOD || me.group === groups.ADMIN) && user.group === groups.APPRENTICE;
	},

	iCanMod: function(me, user) {
		return me.group === groups.ADMIN && user.group === groups.APPRENTICE;
	},

	iCanDeMod: function(me, user) {
		return me.group === groups.ADMIN && user.group === groups.MOD && String(user._id) !== String(me._id);
	},

	iCanBan: function(me, user) {
		var ban = banFns.findActiveBan(user.bans);
		return Boolean((me.group === groups.MOD || me.group === groups.ADMIN) && String(user._id) !== String(me._id) && !ban);
	},

	iCanDeBan: function(me, user) {
		var ban = banFns.findActiveBan(user.bans);
		return Boolean((me.group === groups.MOD || me.group === groups.ADMIN) && String(user._id) !== String(me._id) && ban);
	},

	iCanReport: function(me, user) {
		return me.group === groups.APPRENTICE && String(user._id) !== String(me._id);
	},

	iCanGuildMod: function(me, user, guild) {
		return (
			check.inSameGuild(me, user) &&
			!check.isSameUser(me, user) &&
			check.isOwner(me, guild) &&
			!check.isGuildMod(user, guild)
		);
	},

	iCanDeGuildMod: function(me, user, guild) {
		return Boolean(me.guild === user.guild && String(user._id) !== String(me._id) && guild.getOwner(me._id) && guild.getGuildMod(user._id) && !guild.getOwner(user._id));
	},

	iCanKick: function(me, user, guild) {
		return (
			!check.isSameUser(me, user) &&
			check.isGuildMod(me, guild) &&
			!check.isKicked(user, guild) &&
			check.inSameGuild(me, user)
		);
	},

	iCanDeKick: function(me, user, guild) {
		return (
			!check.isSameUser(me, user) &&
			check.isGuildMod(me, guild) &&
			check.isKicked(user, guild)
		);
	}

};