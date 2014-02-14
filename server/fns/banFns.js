'use strict';

var _ = require('lodash');

module.exports = {

	findActiveBanTypes: function(bans) {
		var date = new Date();
		var activeTypes = {};
		_.each(bans, function(ban) {
			if(ban.expireDate > date) {
				activeTypes[ban.type] = ban;
			}
		});
		return activeTypes;
	},

	findActiveBan: function(bans) {
		var active = module.exports.findActiveBanTypes(bans);
		var ban = active.ban || active.silence;
		return ban;
	}

};
