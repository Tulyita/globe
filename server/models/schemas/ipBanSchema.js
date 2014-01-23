'use strict';

var mongoose = require('mongoose');
var isIp = require('../../validators/isIp');

var ipBanSchema = new mongoose.Schema({
	_id: {
		type: String,
		validate: isIp,
		required: true
	},
	date: {
		type: Date,
		default: Date,
		expires: '7d'
	}
});

module.exports = ipBanSchema;