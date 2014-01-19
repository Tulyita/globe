'use strict';

var validate = require('mongoose-validator').validate;
var isIp = require('../../validators/isIp');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	fromUserId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	ip: {
		type: String,
		validate: isIp,
		required: true
	},
	body: {
		type: String,
		validate: validate('len', 1, 300),
		required: true
	},
	date: {
		type: Date,
		default: Date
	}
});

module.exports = MessageSchema;