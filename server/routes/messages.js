'use strict';

var User = require('../models/user');
var isMessage = require('../validators/isMessage');
var _ = require('lodash');
var mongoose = require('mongoose');

var msgs = {};


msgs.get = function(req, res) {
	User.findById(req.session._id, {messages: 1}, {}, function(err, user) {
		if(err) {
			return res.apiOut(err);
		}
		if(!user) {
			return res.apiOut('User not found.');
		}
		return res.apiOut(null, user.messages);
	});
};


msgs.post = function(req, res) {
	var message = msgs.formMessage(req);
	msgs.saveMessage(req.body.toUserId, message, function(err) {
		if(err) {
			return res.apiOut(err);
		}
		return res.apiOut(null, message);
	});
};


msgs.formMessage = function(req) {
	var message = _.pick(req.body, 'body');
	message.fromUser = _.pick(req.session, '_id', 'name', 'site', 'group');
	message.ip = req.connection.remoteAddress;
	message.date = new Date();
	message._id = mongoose.Types.ObjectId();
	return message;
};


msgs.saveMessage = function(toUserId, message, callback) {
	if(!isMessage(message)) {
		return callback('Not a valid message.');
	}

	return User.update({_id: toUserId}, {$push: {messages: message}}, callback);
};


module.exports = msgs;