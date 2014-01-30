'use strict';

var _ = require('lodash');
var User = require('../models/user');
var IpBan = require('../models/ipBan');
var isBans = require('../validators/isBans');
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



module.exports = {

	// private functions
	_saveIpBan: saveIpBan,
	_pruneOldBans: pruneOldBans,
	_determineDuration: determineDuration,


	/**
	 * Handle a post request
	 * @param req
	 * @param res
	 */
	post: function(req, res) {

		var bans = req.user.bans;
		var ip = req.user.ip;

		var newBan = _.pick(req.body, 'type', 'privateInfo', 'publicInfo', 'reason');
		newBan.expireDate = new Date() + determineDuration(bans);
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

				return res.apiOut(null, newBan);
			});
		});
	},


	/**
	 * Output a user's bans
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	get: function(req, res) {
		res.apiOut(null, req.user.bans);
	}

};