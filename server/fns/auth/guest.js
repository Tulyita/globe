'use strict';

var names = require('./guestNames');
var createHashId = require('../createHashId');

var guest = {

	/**
	 * Create a name based on an ip
	 * @param {string} ip
	 * @returns {string}
	 */
	ipToName: function(ip) {
		var salt = 'osF%37ghe6';
		var hash = createHashId(ip + salt, 6);
		var hash1 = hash.substr(0, 3);
		var hash2 = hash.substr(3);
		var num = parseInt(hash1.toLowerCase(), 36);
		var nameIndex = num % names.length;
		var name = names[nameIndex] + '-' + hash2;
		return name;
	},


	/**
	 * Create a guest account
	 * @param data
	 * @param callback
	 */
	authenticate: function(data, callback) {
		var name = guest.ipToName(data.ip);
		return callback(null, {
			name: name,
			group: 'g',
			site: 'g',
			siteUserId: name
		});
	}

};

module.exports = guest;