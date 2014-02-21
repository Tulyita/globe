var nameDisplayDoc = require('./nameDisplayDoc');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isNameDisplay = require('../../validators/isNameDisplay');

var ReportSchema = new Schema({
	type: {
		type: String,
		enum: ['convo', 'chat', 'card']
	},
	privateData: {
		type: mongoose.Schema.Types.Mixed
	},
	publicData: {
		type: mongoose.Schema.Types.Mixed
	},
	user: {
		type: nameDisplayDoc,
		validate: isNameDisplay,
		required: true
	},
	date: {
		type: Date,
		expires: 60*60*24*7,
		default: Date
	},
	seen: {
		type: Boolean,
		default: false
	},
	note: {
		type: String
	},
	app: {
		type: String
	}
});

module.exports = ReportSchema;