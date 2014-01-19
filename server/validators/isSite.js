'use strict';

var sites = require('../fns/sites');

var isSite = function(val) {
	return [sites.GUEST, sites.JIGGMIN, sites.KONGREGATE, sites.NEWGROUNDS, sites.FACEBOOK, sites.ARMOR_GAMES].indexOf(val) !== -1;
};

module.exports = isSite;