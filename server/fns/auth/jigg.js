/* jshint camelcase: false */

'use strict';

var request = require('request');
var groups = require('../../config/groups');


var jigg = {

	authenticate: function(data, callback) {

		request.post('https://jiggmin.com/-use-login-token.php', {form: {token: data.token}}, function(err, response, body) {
			if(err) {
				return callback(err);
			}
			if(!body) {
				return callback('no reply from Jiggmin.com');
			}

			body = JSON.parse(body);

			if(body.error) {
				return callback('Jiggmin login token was not accepted: ' + body.error);
			}
			if(body.banned) {
				return callback('Your account on jiggmin.com has been banned.');
			}

			var verified = {
				site: 'j',
				name: body.user_name,
				siteUserId: body.user_id,
				avatar: body.avatar,
				group: jigg.powerToGroup(body.power),
				beta: body.beta
			};

			// remove empty string which messes with validation
			if(!verified.avatar) {
				delete verified.avatar;
			}

			return callback(err, verified);
		});
	},


	/**
	 * Convert power (0-3) to group (g,u,m,a)
	 * The gamehub login system assigns a power to users. Higher power = more moderator privileges
	 * Futurism uses groups to do the same thing, so this function turns gamehub powers into futurism groups
	 * @param {number} power
	 * @returns {string}
	 */
	powerToGroup: function(power) {
		var group = groups.GUEST;
		if(power === 1) {
			group = groups.USER;
		}
		if(power === 2) {
			group = groups.MOD;
		}
		if(power === 3) {
			group = groups.ADMIN;
		}
		return group;
	}

};

module.exports = jigg;