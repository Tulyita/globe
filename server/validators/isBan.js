'use strict';

var _ = require('lodash');
var isObjectId = require('./isObjectId');
var isBanType = require('./isBanType');
var isNameDisplay = require('./isNameDisplay');
var isIp = require('./isIp');

var isBan = function(val) {
	var extraKeys = _.without(_.keys(val) ,'_id', 'expireDate', 'type', 'mod', 'reason', 'date', 'ip', 'privateInfo', 'publicInfo');
	return extraKeys.length === 0 && isObjectId(val._id) && isBanType(val.type) && isNameDisplay(val.mod) && _.isDate(val.expireDate) && _.isString(val.reason) && _.isDate(val.date) && isIp(val.ip);
};

module.exports = isBan;