'use strict';

var _ = require('lodash');
var User = require('../models/user');


var bansPost  = function(req, res) {
	var ban = req.body;


	bansPost.getBanHistory(ban.userId, function(err, bans) {
		if(err) {
			return res.apiOut(err);
		}

		bans = bansPost.pruneOldBans(bans);
		var duration = bansPost.determineDuration(bans);

		ban.expireDate = new Date() + duration;
		ban.mod = _.pick(req.session, '_id', 'name', 'site', 'group');
		bans.push(ban);

		bansPost.saveBans(ban.userId, bans, function(err) {
			if(err) {
				return res.apiOut(err);
			}

			return res.apiOut(null, ban);
		});
	});
};


bansPost.saveBans = function(userId, bans, callback) {
	User.findByIdAndUpdate(userId, {bans: bans}, callback);
};


bansPost.getBanHistory = function(userId, callback) {
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
};


bansPost.pruneOldBans = function(bans) {
	var thisYear = new Date().getFullYear();
	var oneYearAgo = new Date().setYear(thisYear-1);

	bans = _.filter(bans, function(ban) {
		return ban.expireDate < oneYearAgo;
	});

	return bans;
};


bansPost.determineDuration = function(bans) {
	var len = bans.length;
	var dur;
	if(len === 0) {
		dur = 60*60*24; // one day
	}
	else if(len === 1) {
		dur = 60*60*24*3; // three days
	}
	else if(len === 2) {
		dur = 60*60*24*7; // seven days
	}
	else {
		dur = 60*60*24*365*9; // nine years
	}
	return dur;
};

module.exports = bansPost;