'use strict';

var _ = require('lodash');

var isGuildDesc = function(val) {
	if(!_.isString(val)) {
		return false;
	}
	return (val.length > 0 && val.length <= 200);
};

module.exports = isGuildDesc;