'use strict';

var isObjectId = require('./isObjectId');
var isName = require('./isName');
var isSite = require('./isSite');
var isGroup = require('./isGroup');
var _ = require('lodash');

var isNameDisplay = function(val) {
	var extraKeys = _.without(_.keys(val) ,'_id', 'name', 'site', 'group');
	return val && extraKeys.length === 0 && isObjectId(val._id) && isName(val.name) && isSite(val.site) && isGroup(val.group);
};

module.exports = isNameDisplay;