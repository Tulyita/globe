'use strict';

var isObjectId = require('./isObjectId');
var isIp = require('./isIp');
var isMessageBody = require('./isMessageBody');
var isNameDisplay = require('./isNameDisplay');
var _ = require('lodash');


var isMessage = function(val) {
	var extraKeys = _.without(_.keys(val) ,'_id', 'fromUser', 'toUser', 'ip', 'body', 'date');
	return extraKeys.length === 0 && isObjectId(val._id) && isNameDisplay(val.fromUser) && isNameDisplay(val.toUser) && isIp(val.ip) && isMessageBody(val.body) && _.isDate(val.date);
};

module.exports = isMessage;