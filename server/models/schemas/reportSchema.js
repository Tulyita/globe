var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NameSchema = require('./nameSchema');

var ReportSchema = new Schema({
	type: {
		type: String,
		enum: ['message', 'chat', 'card'],
		required: true
	},
	data: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	fromUser: {
		type: NameSchema,
		required: true
	},
	created: {
		type: Date,
		default: Date.now,
		expires: 60*60*7
	},
	seen: {
		type: Boolean,
		default: false
	}
});

module.exports = ReportSchema;