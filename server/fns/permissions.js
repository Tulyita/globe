'use strict';

var banFns = require('./banFns');
var groups = require('../config/groups');


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
	}

};