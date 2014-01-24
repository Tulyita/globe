/**
 * Create a session for a user based on their login status with other sites
 * Returns a token that can be used to continue this session for future requests
 */

(function() {
	'use strict';

	var _ = require('lodash');
	var session = require('../fns/redisSession');
	var User = require('../models/user');
	var IpBan = require('../models/ipBan');
	var authServices = require('../fns/auth/authServices');

	var tokens = {};



	/**
	 * Go through all of the steps required to make a session
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	tokens.get = function(req, res) {

		tokens.checkIpBan(req.ip, function(err) {
			if(err) {
				return res.apiOut(err);
			}

			return authServices.authenticate(req.body, function(err, verified) {
				if(err) {
					return res.apiOut(err);
				}

				return tokens.saveUser(verified, function(err, user) {
					if(err) {
						return res.apiOut(err);
					}

					return tokens.processUser(user, function(err) {
						if(err) {
							return res.apiOut(err);
						}

						return tokens.startSession(user, function(err, token) {
							if(err) {
								return res.apiOut(err);
							}

							return res.apiOut(null, {token: token});
						});
					});
				});
			});
		});
	};


	/**
	 * Delete a token
	 * @param req
	 * @param res
	 */
	tokens.del = function(req, res) {
		if(!req.session._id || !req.body.token) {
			return res.apiOut('No token to delete', null);
		}
		var token = req.body.token;
		return session.destroy(token, res.apiOut);
	};


	/**
	 * Prevent frequent offenders from logging in
	 * @param {string} ip
	 * @param {Function} callback
	 */
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


	/**
	 * Save new user to mongo, or update an existing one
	 * @param verified
	 * @param callback
	 */
	tokens.saveUser = function(verified, callback) {
		User.findOneAndSave({site: verified.site, siteUserId: verified.siteUserId}, verified, function(err, user) {
			if(err) {
				return callback(err);
			}

			return callback(null, user);
		});
	};


	/**
	 * Make changes to a user
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
	 * Create a session for a user
	 * @param user
	 * @param callback
	 */
	tokens.startSession = function(user, callback) {
		session.make(user._id, _.pick(user, '_id', 'name', 'site', 'group', 'silencedUntil', 'guild'), function(err, response, token) {
			if(err) {
				return callback(err);
			}
			return callback(null, token);
		});
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
			if(ban.type === type && (!newestBan || newestBan.expireDate < ban.date)) {
				newestBan = ban;
			}
		});
		return newestBan;
	};


	module.exports = tokens;

}());