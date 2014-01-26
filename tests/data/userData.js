'use strict';

var mongoose = require('mongoose');
var Sites = require('../../server/config/sites');
var Groups = require('../../server/config/groups');

module.exports = function() {
	return {
		_id: mongoose.Types.ObjectId(),
		name: 'Zack',
		site: Sites.JIGGMIN,
		siteUserId: 'jigg123',
		group: Groups.MOD
	};
};