'use strict';

var _ = require('lodash');

var isObjectId = function(val) {
	if(!val) {
		return false;
	}
	if(val.toString) {
		val = val.toString();
	}
	if(!_.isString(val)) {
		return false;
	}
	return /^[0-9a-fA-F]{24}$/.test(val);
};

module.exports = isObjectId;