'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nameDisplayDoc = require('./../schemas/nameDisplayDoc');
var memberDoc = require('./memberDoc');
var isName = require('../../validators/isName');
var isGuildDesc = require('../../validators/isGuildDesc');

var nameSchema = new Schema(nameDisplayDoc);
var memberSchema = new Schema(memberDoc);

var GuildSchema = new Schema({
	_id: {
		type: String,
		validate: isName,
		required: true
	},
	join: {
		type: String,
		enum: ['invite', 'ask', 'open'],
		default: 'invite'
	},
	desc: {
		type: String,
		validate: isGuildDesc
	},
	createdDate: {
		type: Date,
		default: Date
	},
	activeDate: {
		type: Date,
		default: Date
	},
	hasBanner: {
		type: Boolean,
		default: false
	},
	gp: {
		type: Number,
		min: 0,
		default: 0
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
	gpLife: {
		type: Number,
		min: 0,
		default: 0
	},
	owners: [nameSchema],
	members: [memberSchema],
	kicks: [nameSchema],
	applicants: [nameSchema],
	invitations: [nameSchema]
});

GuildSchema.statics.INVITE = 'invite';
GuildSchema.statics.ASK = 'ask';
GuildSchema.statics.OPEN = 'open';


require('./auth')(GuildSchema);
require('./lists')(GuildSchema);
require('./gp')(GuildSchema);





module.exports = GuildSchema;