'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isName = require('../../validators/isName');
var isSite = require('../../validators/isSite');
var isGroup = require('../../validators/isGroup');

var NameSchema = new Schema({
	name: {
		type: String,
		validate: isName,
		required: true
	},
	site: {
		type: String,
		validate: isSite,
		required: true
	},
	group: {
		type: String,
		enum: isGroup,
		required: true
	}
});

module.exports = NameSchema;