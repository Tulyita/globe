'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nameDisplayDoc = require('./nameDisplayDoc');
var isName = require('../../validators/isName');
var isGuildDesc = require('../../validators/isGuildDesc');
var isSite = require('../../validators/isSite');
var isGroup = require('../../validators/isGroup');

var nameSchema = new Schema(nameDisplayDoc);

var MemberSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
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
	gpLife: {
		type: Number,
		min: 0,
		default: 0
	}
});

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
	banner: {
		file: {
			type: String
		},
		updated: {
			type: Date
		}
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
	members: [MemberSchema],
	kicks: [nameSchema],
	applicants: [nameSchema],
	invites: [nameSchema]
});

GuildSchema.statics.INVITE = 'invite';
GuildSchema.statics.ASK = 'ask';
GuildSchema.statics.OPEN = 'open';


GuildSchema.statics.findExistingById = function(id, fields, callback) {
    if(!callback) {
        callback = fields;
    }
    this.findById(id, fields, function (err, doc) {
        if (err) {
            return callback(err);
        }
        if (!doc) {
            return callback('Guild "' + id + '" not found.');
        }
        return callback(null, doc);
    });
};



require('./guildGeters')(GuildSchema);
require('./guildMethods')(GuildSchema);



module.exports = GuildSchema;