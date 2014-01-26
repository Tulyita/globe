'use strict';

var mongoose = require('mongoose');
var Sites = require('../../server/config/sites');
var Groups = require('../../server/config/groups');

module.exports = function() {
	return {
		_id: mongoose.Types.ObjectId(),
		name: 'Sally',
		site: Sites.KONGREGATE,
		siteUserId: 'kong123',
		group: Groups.USER
	};
};