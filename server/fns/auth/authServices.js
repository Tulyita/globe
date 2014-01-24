'use strict';

var sites = require('../../fns/sites');
var facebook = require('./facebook');
var guest = require('./guest');
var jigg = require('./jigg');
var kong = require('./kong');

var authServices = {};

/**
 * Validate a login from a remote site
 * @param {Object} data
 * @param {Function} callback
 */
authServices.authenticate = function(data, callback) {

	// find the right authenticator
	var auth = authServices.siteToAuth(data.site);
	if(!auth) {
		return callback('site not found');
	}

	// use a remote service to verify user information
	return auth.authenticate(data, function(err, verified) {
		if(err) {
			return callback(err);
		}
		if(!verified.name || !verified.site || !verified.siteUserId || !verified.group) {
			return callback('Name, site, siteUserId, and group are required from auth.');
		}

		return callback(null, verified);
	});
};


/**
 * Find the auth service for a particular site
 * @param {string} site
 * @returns {*}
 */
authServices.siteToAuth = function(site) {
	var auth;

	if(site === sites.GUEST) {
		auth = guest;
	}
	if(site === sites.JIGGMIN) {
		auth = jigg;
	}
	if(site === sites.FACEBOOK) {
		auth = facebook;
	}
	if(site === sites.KONGREGATE) {
		auth = kong;
	}

	return auth;
};


module.exports = authServices;