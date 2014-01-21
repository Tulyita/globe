'use strict';

var isName = require('../../validators/isName');
var isSite = require('../../validators/isSite');
var isGroup = require('../../validators/isGroup');

var MemberDoc = {
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
		validate: isGroup,
		required: true
	},
	mod: {
		type: Boolean,
		default: false
	},
	gpDay: {
		type: Number,
		min: 0,
		default: 0
	},
	gpWeek: {
		type: Number,
		min: 0,
		default: 0
	},
	gpLifetime: {
		type: Number,
		min: 0,
		default: 0
	}
};

module.exports = MemberDoc;