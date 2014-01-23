/**
 * Create a session for a user based on their login status with other sites
 * Returns a token that can be used to continue this session for future requests
 */

(function() {
	'use strict';

	var _ = require('lodash');
	var async = require('async');
	var session = require('../fns/redisSession');
	var sites = require('../fns/sites');
	var User = require('../models/user');
	var IpBan = require('../models/ipBan');

	var facebook = require('../fns/auth/facebook');
	var guest = require('../fns/auth/guest');
	var jigg = require('../fns/auth/jigg');
	var kong = require('../fns/auth/kong');

	var tokens = {};


	/**
	 * Find the auth service for a particular site
	 * @param {string} site
	 * @returns {*}
	 */
	tokens.siteToAuth = function(site) {
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


	/**
	 * Go through all of the steps required to make a session
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	tokens.get = function(req, res) {

		tokens.checkIpBan(req.ip, function(err) {
			if(err) {
				res.apiOut(err);
			}

			tokens.authenticate(req.body, function(err, verified) {
				if(err) {
					res.apiOut(err);
				}

				tokens.saveUser(verified, function(err, user) {
					if(err) {
						res.apiOut(err);
					}

					tokens.processUser(user, function(err) {
						if(err) {
							res.apiOut(err);
						}

						tokens.startSession(user, function(err, token) {
							if(err) {
								res.apiOut(err);
							}

							res.apiOut(null, {token: token});
						});
					});
				});
			});
		});
	};


	tokens.checkIpBan = function(ip, callback) {
		IpBan.find({ip: ip}, function(err, ipBans) {
			if(err) {
				return callback('Could not check ip bans.');
			}
			if(ipBans.length >= 3) {
				return callback('This ip address has been temporarily blocked due to frequent abuse.');
			}
			return callback(null);
		});
	};


	tokens.authenticate = function(data, callback) {

		// find the right authenticator
		var auth = tokens.siteToAuth(data.site);
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


	// save verified data to the database
	tokens.saveUser = function(verified, callback) {
		User.findOneAndSave({site: verified.site, siteUserId: verified.siteUserId}, verified, function(err, user) {
			if(err) {
				return callback(err);
			}

			return callback(null, user);
		});
	};


	/**
	 * Make changes to user before starting the session
	 * @param user
	 * @param callback
	 * @returns {*}
	 */
	tokens.processUser = function(user, callback) {
		var ban = tokens.findActiveBan(user.bans);
		if(ban) {
			if(ban.type === 'ban') {
				return callback('This account has been banned until ' + ban.expireDate + '. Reason: ' + ban.reason);
			}
			if(ban.type === 'silence') {
				user.silencedUntil = ban.expireDate;
			}
		}
		return callback(null);
	};


	/**
	 * Look through all the bans on a user and return the active one if it exists
	 * @param bans
	 * @returns {Ban}
	 */
	tokens.findActiveBan = function(bans) {
		var silence = tokens.findNewestBan(bans, 'silence');
		var ban = tokens.findNewestBan(bans, 'ban');
		if(ban && ban.expireDate > new Date()) {
			return ban;
		}
		if(silence && silence.expireDate > new Date()) {
			return silence;
		}
		return null;
	};


	/**
	 * Find the newest ban of a certain type
	 * @param bans
	 * @param type
	 * @returns {Ban}
	 */
	tokens.findNewestBan = function(bans, type) {
		var newestBan = null;
		_.each(bans, function(ban) {
			if(ban.type === type && !newestBan || newestBan.expireDate < ban.date) {
				newestBan = ban;
			}
		});
		return newestBan;
	};


	// create a session for this user
	tokens.startSession = function(req, callback) {
		session.make(user._id, _.pick(user, '_id', 'name', 'site', 'group', 'silencedUntil', 'guildId'), function(err, response, token) {
			if(err) {
				return res.apiOut(err);
			}
		});
	};






	tokens.delete = function(req, res) {

	};


	module.exports = tokens;

}());