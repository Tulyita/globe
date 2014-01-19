'use strict';

var _ = require('lodash');

var isIp = function(val) {
	if(!_.isString(val)) {
		return false;
	}
	var isIpv6 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i.test(val);
	var isIpv4 = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$){4}\b/.test(val);
	return isIpv6 || isIpv4;
};

module.exports = isIp;