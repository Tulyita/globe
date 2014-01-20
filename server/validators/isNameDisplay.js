'use strict';

var isObjectId = require('./isObjectId');
var isName = require('./isName');
var isSite = require('./isSite');
var isGroup = require('./isGroup');
var _ = require('lodash');

var isNameDisplay = function(val) {
	if(!val) {
		return false;
	}
	if(!isObjectId(val._id) ||  !isName(val.name) || !isSite(val.site) || !isGroup(val.group)) {
		return false;
	}
	if(_.keys(val).length > 4) {
		return false;
	}
	return true;
};

module.exports = isNameDisplay;