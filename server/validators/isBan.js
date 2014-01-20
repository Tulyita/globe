'use strict';

var _ = require('lodash');
var isObjectId = require('./isObjectId');
var isBanType = require('./isBanType');
var isNameDisplay = require('./isNameDisplay');
var isIp = require('./isIp');

var isBan = function(val) {
	if(!isObjectId(val._id) || !isBanType(val.type) || !isNameDisplay(val.mod) || !_.isDate(val.expireDate) || !_.isString(val.reason)) {
		return false;
	}
	if(val.date && !_.isDate(val.date)) {
		return false;
	}
	if(val.ip && !isIp(val.ip)) {
		return false;
	}

	var extraKeys = _.without(_.keys(val) ,'_id', 'expireDate', 'type', 'mod', 'reason', 'date', 'ip', 'privateInfo', 'publicInfo');
	if(extraKeys.length > 0) {
		return false;
	}

	return true;
};

module.exports = isBan;