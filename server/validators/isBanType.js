'use strict';

var isBanType = function(val) {
	return ['ban', 'silence'].indexOf(val) !== -1;
};

module.exports = isBanType;