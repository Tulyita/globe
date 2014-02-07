'use strict';

var User = require('../models/user');
var isMessage = require('../validators/isMessage');
var _ = require('lodash');
var mongoose = require('mongoose');
var convoFns = require('../fns/convoFns');


var formMessage = function(req) {
	var message = {
		_id: mongoose.Types.ObjectId(),
		body: req.body.body,
		toUser: _.pick(req.user, '_id', 'name', 'group', 'site'),
		fromUser: _.pick(req.myself, '_id', 'name', 'group', 'site'),
		ip: req.ip,
		read: false,
		date: new Date()
	};

	return message;
};


var saveMessage = function(toUser, fromUser, message, callback) {

	message.read = false;
	toUser.messages.push(message);
	toUser.save(function(err) {
		if(err) {
			return callback(err);
		}

		message.read = true;
		fromUser.messages.push(message);
		fromUser.save(function(err) {
			if(err) {
				return callback(err);
			}
			return callback(null);
		});
	});
};




module.exports = {

	// private methods
	_formMessage: formMessage,
	_saveMessage: saveMessage,


	get: function(req, res) {
		return res.apiOut(null, convoFns.copyPublicData(req.myself.messages));
	},


	post: function(req, res) {

		var message = formMessage(req);

		saveMessage(req.user, req.myself, message, function(err) {
			if(err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, message);
		});
	},


	getUnreadCount: function(req, res) {
		var count = 0;
		_.each(req.myself.messages, function(message) {
			if(!message.read) {
				count++;
			}
		});
		return res.apiOut(null, count);
	}
};