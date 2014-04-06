'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nameDisplayDoc = require('./schemas/nameDisplayDoc');

var modLogSchema = new Schema({
	type: String,
	mod: {
		type: nameDisplayDoc
	},
	user: {
		type: nameDisplayDoc
	},
	data: mongoose.Schema.Types.Mixed,
	date: {
		type: Date,
		default: Date
	}
});

var ModLog = mongoose.model('ModLog', modLogSchema);
module.exports = ModLog;