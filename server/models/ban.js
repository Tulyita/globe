'use strict';

var isIp = require('../fns/isIp');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BanSchema = new Schema({
	type: {
		type: String,
		enum: ['ban', 'silence']
	},
	banAccount: Boolean,
	banIp: Boolean,
	ip: {
		type: String,
		validate: isIp
	},
	privateInfo: Schema.Types.Mixed,
	publicInfo: Schema.Types.Mixed,
	mod: {
		name: String,
		site: String,
		group: {
			type: String,
			enum: ['m', 'a']
		}
	},
	user: {
		name: String,
		site: String,
		group: String
	},
	expireDate: Date,
	date: {
		type: Date,
		default: Date,
		expires: 60 * 60 * 24 * 30 * 12 //one year
	},
	reason: String
});

var Ban = mongoose.model('Ban', BanSchema);
module.exports = Ban;