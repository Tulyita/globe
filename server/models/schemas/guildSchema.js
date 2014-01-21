var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nameDisplayDoc = require('./nameDisplayDoc');
var memberDoc = require('./memberDoc');
var isName = require('../../validators/isName');
var isUrl = require('../../validators/isUrl');

var nameSchema = new Schema(nameDisplayDoc);
var memberSchema = new Schema(memberDoc);

var GuildSchema = new Schema({
	name: {
		type: String,
		validate: isName,
		required: true
	},
	join: {
		type: String,
		enum: ['inviteOnly', 'requestToJoin', 'allWelcome'],
		required: true
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
	gpLifetime: {
		type: Number,
		min: 0,
		default: 0
	},
	owners: [nameSchema],
	members: [memberSchema],
	joinRequests: [nameSchema],
	invitations: [nameSchema]
});

module.exports = GuildSchema;