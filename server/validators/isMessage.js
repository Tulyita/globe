'use strict';

var isObjectId = require('./isObjectId');
var isIp = require('./isIp');
var isMessageBody = require('./isMessageBody');
var isNameDisplay = require('./isNameDisplay');
var _ = require('lodash');


var isMessage = function(val) {
	if(!isObjectId(val._id)) {
		return false;
	}
	if(!isNameDisplay(val.fromUser)){
		return false;
	}
	if(!isIp(val.ip)){
		return false;
	}
	if(!isMessageBody(val.body)){
		return false;
	}
	if(!_.isDate(val.date)){
		return false;
	}

	var extraKeys = _.without(_.keys(val) ,'_id', 'fromUser', 'ip', 'body', 'date');
	if(extraKeys.length > 0) {
		return false;
	}

	return true;
};

module.exports = isMessage;