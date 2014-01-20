'use strict';

var isIp = require('../../validators/isIp');
var NameDoc = require('./nameDoc');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BanDoc = {
	type: {
		type: String,
		enum: ['ban', 'silence'],
		required: true
	},
	mod: {
		type: NameDoc,
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
};

module.exports = BanDoc;