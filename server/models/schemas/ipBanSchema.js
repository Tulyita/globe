'use strict';

var mongoose = require('mongoose');
var isIp = require('../../validators/isIp');

var ipBanSchema = new mongoose.Schema({
	ip: {
		type: String,
		validate: isIp,
		required: true
	},
	date: {
		type: Date,
		default: Date,
		expires: '14d'
	}
});

module.exports = ipBanSchema;