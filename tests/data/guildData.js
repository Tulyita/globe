'use strict';

var Guild = require('../../server/models/guild');

module.exports = function() {
	return {
		_id: 'Great Guild',
		join: Guild.INVITE,
		createdDate: new Date(),
		activeDate: new Date(),
		hasBanner: false,
		owners: [],
		members: []
	};
};