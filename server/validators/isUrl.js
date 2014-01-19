'use strict';

var isUrl = function(val) {
	var isUrl = /^(http:\/\/)|(https:\/\/)/.test(val);
	return (val.length >= 0 && val.length <= 150 && isUrl);
};

module.exports = isUrl;