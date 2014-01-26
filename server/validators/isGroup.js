'use strict';

var groups = require('../config/groups');

var isGroup = function(val) {
	return [groups.GUEST, groups.USER, groups.APPRENTICE, groups.MOD, groups.ADMIN].indexOf(val) !== -1;
};

module.exports = isGroup;