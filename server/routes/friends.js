'use strict';

var _ = require('lodash');
var User = require('../models/user');

var friends = {};


/**
 * Get a list of your friends
 * @param req
 * @param res
 */
friends.get = function(req, res) {
	User.findById(req.session._id, {friends: 1}, function(err, user) {
		if(err) {
			return res.apiOut(err);
		}
		if(!user) {
			return res.apiOut('User "' + req.session._id + '" not found.');
		}
		return res.apiOut(null, user.friends);
	});
};


/**
 * Forward requests to other functions
 * @param req
 * @param res
 * @returns {*}
 */
friends.post = function(req, res) {
	var action = req.body.action;

	if(action === 'add') {
		friends.addFriend(req, res);
	}
	else if(action === 'remove') {
		friends.removeFriend(req, res);
	}
	else {
		return res.apiOut('Action "'+action+'" not found.');
	}
};


/**
 * Add a friend to your account
 * @param req
 * @param res
 */
friends.addFriend = function(req, res) {

	User.findById(req.session._id, {friends: 1}, function(err, me) {
		if(err) {
			return res.apiOut(err);
		}
		if(!me) {
			return res.apiOut('Could not find your account with id "'+req.session._id+'".');
		}

		return User.findById(req.body.userId, {_id: 1, name: 1, site: 1, group: 1}, function(err, user) {
			if(err) {
				return res.apiOut(err);
			}
			if(!user) {
				return res.apiOut('Could not find account "'+req.body.userId+'".');
			}

			me.friends = me.friends || [];
			me.friends = _.filter(me.friends, function(friend) {
				return friend._id !== user._id;
			});
			me.friends.push(user);

			return me.save(function(err) {
				if(err) {
					return res.apiOut(err);
				}

				return res.apiOut(null, me.friends);
			});
		});
	});
};


/**
 * Remove a friend from your account
 * @param req
 * @param res
 */
friends.removeFriend = function(req, res) {

	User.findById(req.session._id, {friends: 1}, function(err, me) {
		if(err) {
			return res.apiOut(err);
		}
		if(!me) {
			return res.apiOut('Could not find your account with id "'+req.session._id+'".');
		}

		me.friends = me.friends || [];
		me.friends = _.filter(me.friends, function(friend) {
			return friend._id !== req.body.userId;
		});

		return me.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}

			return res.apiOut(null, me.friends);
		});
	});
};


module.exports = friends;