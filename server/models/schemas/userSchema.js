'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator').validate;
var isGroup = require('../../validators/isGroup');
var isIp = require('../../validators/isIp');
var isSite = require('../../validators/isSite');
var isName = require('../../validators/isName');
var isUrl = require('../../validators/isUrl');
var messageSchema = require('./messageSchema');
var nameSchema = require('./nameSchema');
var banSchema = require('./banSchema');

var UserSchema = new Schema({
	site: {
		type: String,
		validate: isSite,
		required: true
	},
	name: {
		type: String,
		validate: isName,
		required: true
	},
	group: {
		type: String,
		validate: isGroup,
		required: true
	},
	avatar: {
		type: String,
		validate: isUrl
	},
	siteUserId: {
		type: String,
		validate: [validate('len', 1, 40), validate('isAlphanumeric')],
		required: true
	},
	ip: {
		type: String,
		validate: isIp
	},
	registerDate: {
		type: Date,
		default: Date
	},
	loginDate: {
		type: Date
	},
	guildId: {
		type: Schema.Types.ObjectId
	},
	messages: {
		type: [messageSchema]
	},
	friends: {
		type: [nameSchema]
	},
	bans: {
		type: [banSchema]
	}
});

module.exports = UserSchema;