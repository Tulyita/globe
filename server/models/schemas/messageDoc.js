'use strict';

var nameDisplayDoc = require('./nameDisplayDoc');
var isIp = require('../../validators/isIp');
var isNameDisplay = require('../../validators/isNameDisplay');
var isMessageBody = require('../../validators/isMessageBody');

var MessageDoc = {
	fromUser: {
		type: nameDisplayDoc,
		validate: isNameDisplay,
		required: true
	},
	toUser: {
		type: nameDisplayDoc,
		validate: isNameDisplay,
		required: true
	},
	body: {
		type: String,
		validate: isMessageBody,
		required: true
	},
	ip: {
		type: String,
		validate: isIp
	},
	date: {
		type: Date,
		default: Date
	},
	read: {
		type: Boolean,
		default: false
	}
};

module.exports = MessageDoc;