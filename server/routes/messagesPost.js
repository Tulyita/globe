'use strict';

var User = require('../models/user');
var isMessage = require('../validators/isMessage');
var _ = require('lodash');
var mongoose = require('mongoose');


var messagesPost = function(req, res) {

	var message = messagesPost.formMessage(req);
	messagesPost.saveMessage(req.body.toUserId, message, function(err) {
		if(err) {
			return res.apiOut(err);
		}
		res.apiOut(null, message);
	});
};


messagesPost.formMessage = function(req) {
	var message = _.pick(req.body, 'body');
	message.fromUser = _.pick(req.session, '_id', 'name', 'site', 'group');
	message.ip = req.connection.remoteAddress;
	message.date = new Date();
	message._id = mongoose.Types.ObjectId();
	return message;
};


messagesPost.saveMessage = function(toUserId, message, callback) {
	if(!isMessage(message)) {
		return callback('Not a valid message.');
	}

	User.update({_id: toUserId}, {$push: {messages: message}}, callback);
};


module.exports = messagesPost;