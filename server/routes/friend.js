'use strict';

var _ = require('lodash');
var User = require('../models/user');


module.exports = {


	put: function(req, res) {

		// remove this user from your friend array if they are already in it
		req.myself.friends = req.myself.removeFriend(req.params.userId);

		// add user to your friends
		req.myself.friends.push(req.user);

		// save and output
		req.myself.save(function(err) {
			return res.apiOut(err, req.myself.getFriend(req.params.userId));
		});
	},


	get: function(req, res) {

		// return 404 if friend does not exist
		var foundFriend = req.myself.getFriend(req.params.userId);
		if(!foundFriend) {
			return res.send(404, 'Friend not found');
		}

		// output
		return res.apiOut(null, foundFriend);
	},


	del: function(req, res) {

		// return 404 if friend does not exist
		var foundFriend = req.myself.getFriend(req.params.userId);
		if(!foundFriend) {
			return res.send(404, 'Friend not found');
		}

		// remove friend
		req.myself.friends = req.myself.removeFriend(req.params.userId);

		// save and output
		return req.myself.save(function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.send(204, '');
		});
	}
};