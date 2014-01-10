/**
 * A collection of simple helper functions
 */

'use strict';


module.exports = {

	/**
	 * Takes a request from express and tries to figure out the ip of the user
	 * @param {Object} req
	 * @returns {String}
	 */
	getIp: function(req) {
		var ip = '';
		if(req.headers['x-forwarded-for']) {
			var arr = req.headers['x-forwarded-for'].split(',');
			ip = arr[0];
		}
		else {
			ip = req.connection.remoteAddress;
		}
		return ip;
	},


	/**
	 * Create a string made up of random characters
	 * @param {number} [len]
	 * @returns {string}
	 */
	createRandomString: function(len) {
		len = len || 12;
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for(var i=0; i<len; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	},


	/**
	 * Fully output an object to a JSON encoded string
	 * @param {*} val
	 * @returns {string}
	 */
	varDump: function(val) {
		var util = require('util');
		var str = util.inspect(val, false, null);
		return str;
	}
};