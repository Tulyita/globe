'use strict';

var isObjectId = require('./isObjectId');
var isIp = require('./isIp');
var isMessageBody = require('./isMessageBody');
var _ = require('lodash');


var isMessage = function(val) {
	if(!isObjectId(val._id) || !isObjectId(val.fromUserId) || !isIp(val.ip) || !isMessageBody(val.body) || !_.isDate(val.date)) {
		return false;
	}

	var extraKeys = _.without(_.keys(val) ,'_id', 'fromUserId', 'ip', 'body', 'date');
	if(extraKeys.length > 0) {
		return false;
	}

	return true;
};

module.exports = isMessage;