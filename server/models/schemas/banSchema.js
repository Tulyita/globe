'use strict';

var isIp = require('../../validators/isIp');
var NameSchema = require('./nameSchema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BanSchema = new Schema({
	type: {
		type: String,
		enum: ['ban', 'silence'],
		required: true
	},
	mod: {
		type: NameSchema,
		required: true
	},
	expireDate: {
		type: Date,
		required: true
	},
	date: {
		type: Date,
		default: Date
	},
	reason: {
		type: String,
		required: true
	},
	ip: {
		type: String,
		validate: isIp
	},
	privateInfo: {
		type: Schema.Types.Mixed
	},
	publicInfo: {
		type: Schema.Types.Mixed
	}
});

module.exports = BanSchema;