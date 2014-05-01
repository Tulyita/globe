'use strict';

var _ = require('lodash');
var redisSession = require('../fns/redisSession');
var IpBan = require('../models/ipBan');
var ModLog = require('../models/ModLog');
var isIp = require('../validators/isIp');


/**
 *
 * @param ip
 * @param callback
 */
var saveIpBan = function(ip, callback) {
	if(!isIp(ip)) {
		return callback(null);
	}
	return IpBan.create({ip: ip, date: new Date()}, function(err) {
		if(err) {
			return callback(err);
		}
		return callback(null);
	});
};


/**
 * Remove long expired bans from an array
 * @param {Array.<Ban>} bans
 * @returns {Array.<Ban>}
 */
var pruneOldBans = function(bans) {
	var thisYear = new Date().getFullYear();
	var oneYearAgo = new Date().setYear(thisYear-1);

	bans = _.filter(bans, function(ban) {
		return ban.expireDate > oneYearAgo;
	});

	return bans;
};


/**
 * Decide on a ban duration based on how man previous bans there are
 * @param {Array.<Ban>} bans
 * @returns {Number}
 */
var determineDuration = function(bans) {
	var len = bans.length;
	var dur;
	if(len === 0) {
		dur = 1000 * 60 * 60 * 24; // one day
	}
	else if(len === 1) {
		dur = 1000 * 60 * 60 * 24 * 3; // three days
	}
	else if(len === 2) {
		dur = 1000 * 60 * 60 * 24 * 7; // seven days
	}
	else {
		dur = 1000 * 60 * 60 * 24 * 365 * 9; // nine years
	}
	return dur;
};


/**
 * edit or create new values in the user's session
 * @param {ObjectId} userId
 * @param {Object} ban
 * @param {Function} callback
 */
var updateSession = function(userId, ban, callback) {
	var session = {};
	if(ban.type === 'ban') {
		session.bannedUntil = ban.expireDate;
	}
	if(ban.type === 'silence') {
		session.silencedUntil = ban.expireDate;
	}
	redisSession.update(userId, session, callback);
};



module.exports = {

	// private functions
	_saveIpBan: saveIpBan,
	_pruneOldBans: pruneOldBans,
	_determineDuration: determineDuration,
	_updateSession: updateSession,


	/**
	 * Handle a post request
	 * @param req
	 * @param res
	 */
	post: function(req, res) {

		var bans = req.user.bans;
		var ip = req.user.ip;

		var newBan = _.pick(req.body, 'type', 'privateInfo', 'publicInfo', 'reason');
		newBan.expireDate = new Date(new Date().getTime() + determineDuration(bans));
		newBan.mod = _.pick(req.session, '_id', 'name', 'site', 'group');
		newBan.ip = ip;

		bans.push(newBan);
		bans = pruneOldBans(bans);

		req.user.bans = bans;
		req.user.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}

			return saveIpBan(ip, function(err) {
				if(err) {
					return res.apiOut(err);
				}

				return updateSession(req.params.userId, newBan, function(err) {
					if(err) {
						return res.apiOut(err);
					}

					ModLog.create({
						type: req.body.type,
						mod: _.pick(req.session, '_id', 'name', 'site', 'group'),
						user: _.pick(req.user, '_id', 'name', 'site', 'group'),
						data: {reason: req.body.reason}
					}, function(err) {
						return res.apiOut(err, newBan);
					});

				});
			});
		});
	},


	/**
	 * Output a user's bans
	 */
	get: function(req, res) {
		res.apiOut(null, req.user.bans);
	},


	/**
	 * Delete a user's ban
	 */
	del: function(req, res) {
		req.user.bans = _.filter(req.user.bans, function(ban) {
			return String(ban._id) !== String(req.params.banId);
		});
		req.user.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}

			redisSession.update(req.user._id, {bannedUntil: 0, silencedUntil: 0}, function(err) {
				if(err) {
					return res.apiOut(err);
				}

				ModLog.create({
					type: 'ban-lift',
					mod: _.pick(req.session, '_id', 'name', 'site', 'group'),
					user: _.pick(req.user, '_id', 'name', 'site', 'group'),
					data: {banId: req.params.banId}
				}, function(err) {
					return res.apiOut(err, {code: 204, response: ''});
				});
			});


		});
	}

};