'use strict';

var _ = require('lodash');
var isBan = require('./isBan');

var isBans = function(val) {
	if(!_.isArray(val)) {
		return false;
	}

	var invalids = _.filter(val, function(ban) {
		if(ban.toObject) {
			ban = ban.toObject();
		}
		return !isBan(ban);
	});

	return invalids.length === 0;
};

module.exports = isBans;