'use strict';

var _ = require('lodash');

var findActiveBans = function(bans) {
	var date = new Date();
	var activeBans = {};
	_.each(bans, function(ban) {
		if(ban.expireDate > date) {
			activeBans[ban.type] = ban;
		}
	});
};

module.exports = findActiveBans;