'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isGroup = require('../../validators/isGroup');
var isIp = require('../../validators/isIp');
var isSite = require('../../validators/isSite');
var isSiteUserId = require('../../validators/isSiteUserId');
var isName = require('../../validators/isName');
var isUrl = require('../../validators/isUrl');
var messageDoc = require('./messageDoc');
var nameDisplayDoc = require('./nameDisplayDoc');
var banDoc = require('./banDoc');

var UserSchema = new Schema({
	site: {
		type: String,
		validate: isSite,
		required: true
	},
	name: {
		type: String,
		validate: isName,
		required: true
	},
	group: {
		type: String,
		validate: isGroup,
		required: true
	},
	siteUserId: {
		type: String,
		validate: isSiteUserId,
		required: true
	},
	avatar: {
		type: String,
		validate: isUrl
	},
	ip: {
		type: String,
		validate: isIp
	},
	registerDate: {
		type: Date,
		default: Date
	},
	loginDate: {
		type: Date,
		default: Date
	},
	guild: {
		type: String,
		validate: isName
	},
    guildInvites: {
        type: [String]
    },
	messages: {
		type: [new Schema(messageDoc)]
	},
	friends: {
		type: [new Schema(nameDisplayDoc)]
	},
	bans: {
		type: [new Schema(banDoc)]
	}
});


UserSchema.statics.publicFields = {
	_id: 1,
	name: 1,
	group: 1,
	site: 1,
	registerDate: 1,
	loginDate: 1,
	guild: 1
};


UserSchema.statics.findExistingById = function(id, fields, callback) {
    if(!callback) {
        callback = fields;
    }
    this.findById(id, fields, function (err, user) {
        if (err) {
            return callback(err);
        }
        if (!user) {
            return callback('User "' + id + '" not found.');
        }
        return callback(null, user);
    });
};


UserSchema.methods.publicData = function() {
	var obj = {};
	var self = this;
	_.each(UserSchema.statics.publicFields, function(val, field) {
		if(val === 1) {
			obj[field] = self[field];
		}
	});
	return obj;
};


UserSchema.methods.getFriend = function(userId) {
	return _.where(this.friends, {id: String(userId)})[0];
};


UserSchema.methods.removeFriend = function(userId) {
	this.friends = _.filter(this.friends, function(user) {
		return user.id !== String(userId);
	});
	return this.friends;
};



module.exports = UserSchema;