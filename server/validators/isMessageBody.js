'use strict';

var _ = require('lodash');

var isMessageBody = function(val) {
	if(!_.isString(val)) {
		return false;
	}

	return val.length > 0 && val.length < 300;
};

module.exports = isMessageBody;