'use strict';

var _ = require('lodash');

var isSiteUserId = function(val) {
	if(!_.isString(val)) {
		return false;
	}
	if(val.length < 0) {
		return false;
	}
	if(val.length > 40) {
		return false;
	}
	if(!/\w/.test(val)) {
		return false;
	}

	return true;
};

module.exports = isSiteUserId;