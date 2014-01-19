'use strict';

var _ = require('lodash');

var isUrl = function(val) {
	if(!_.isString(val)) {
		return false;
	}
	var isUrl = /^(http:\/\/)|(https:\/\/)/.test(val);
	return (val.length >= 0 && val.length <= 150 && isUrl);
};

module.exports = isUrl;