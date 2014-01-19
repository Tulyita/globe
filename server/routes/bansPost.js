'use strict';

var _ = require('lodash');
var User = require('../models/user');


var bansPost  = function(req, res) {
	var ban = req.body;


	User.findById(ban.userId, {bans: 1}, function(err, user) {
		if(err) {
			return res.apiOut(err);
		}
		if(!user) {
			return res.apiOut('User not found.');
		}

		var bans = pruneOldBans(user.bans);
		var duration = determineDuration(bans);

		ban.expireDate = new Date() + duration;
		ban.mod = _.pick(req.session, '_id', 'name', 'site', 'group');

		return User.findByIdAndUpdate(ban.userId, {bans: bans}, function(err) {
			if(err) {
				return res.apiOut(err);
			}

			return res.apiOut(null, bans);
		});
	});
};


var pruneOldBans = function(bans) {
	var oneYearAgo = new Date();
	oneYearAgo.setYear(oneYearAgo.getYear()-1);

	bans = _.filter(bans, function(ban) {
		return ban.expireDate > oneYearAgo;
	});

	return bans;
};


var determineDuration = function(bans) {
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