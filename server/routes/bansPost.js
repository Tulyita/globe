'use strict';

var _ = require('lodash');
var User = require('../models/user');
var isBans = require('../validators/isBans');


var banFns = {

	/**
	 * Handle a post request
	 * @param req
	 * @param res
	 */
	post: function(req, res) {

		var userId = req.body.userId;

		banFns.getBanHistory(userId, function(err, bans) {
			if(err) {
				return res.apiOut(err);
			}

			var ban = _.pick(req.body, 'type', 'privateInfo', 'publicInfo', 'reason');
			ban.expireDate = new Date() + banFns.determineDuration(bans);
			ban.mod = _.pick(req.session, '_id', 'name', 'site', 'group');

			bans.push(ban);
			bans = banFns.pruneOldBans(bans);
			banFns.saveBans(userId, bans, function(err) {
				if(err) {
					return res.apiOut(err);
				}

				return res.apiOut(null, ban);
			});
		});
	},


	/**
	 * Save an array of bans into a User model
	 * @param {ObjectId} userId
	 * @param {Array.<Ban>} bans
	 * @param {Function} callback
	 */
	saveBans: function(userId, bans, callback) {
		if(!isBans(bans)) {
			return callback('isBans validation failed');
		}
		User.update({_id: userId}, {$set: {bans: bans}}, callback);
	},


	/**
	 * Fetch a list of previous bans this user has
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	getBanHistory: function(userId, callback) {
		User.findById(userId, {bans: 1}, function(err, user) {
			if(err) {
				return callback(err);
			}
			if(!user) {
				return callback('User not found.');
			}

			var bans = user.bans || [];
			return callback(null, bans);
		});
	},


	/**
	 * Remove long expired bans from an array
	 * @param {Array.<Ban>} bans
	 * @returns {Array.<Ban>}
	 */
	pruneOldBans: function(bans) {
		var thisYear = new Date().getFullYear();
		var oneYearAgo = new Date().setYear(thisYear-1);

		bans = _.filter(bans, function(ban) {
			return ban.expireDate > oneYearAgo;
		});

		return bans;
	},


	/**
	 * Decide on a ban duration based on how man previous bans there are
	 * @param {Array.<Ban>} bans
	 * @returns {Number}
	 */
	determineDuration: function(bans) {
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
	}
};

module.exports = banFns;