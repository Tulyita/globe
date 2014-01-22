'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../user');
var _ = require('lodash');
var async = require('async');
var nameDisplayDoc = require('./nameDisplayDoc');
var memberDoc = require('./memberDoc');
var isName = require('../../validators/isName');

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

GuildSchema.statics.INVITE = 'invite';
GuildSchema.statics.ASK = 'ask';
GuildSchema.statics.OPEN = 'open';


GuildSchema.methods.isOwner = function (userId) {
	var isOwner = false;
	_.each(this.owners, function(owner) {
		if(String(owner._id) === String(userId)) {
			isOwner = true;
		}
	});
	return isOwner;
};


/**
 * Remove a member from this guild
 * @param {ObjectId} userId
 * @param {Function} callback
 */
GuildSchema.methods.removeMember = function(userId, callback) {
	var remainingMembers = _.filter(this.members, function(member) {
		return String(member._id) !== String(userId);
	});

	if(remainingMembers.length === this.members.length) {
		return callback('You are not a member of this guild.');
	}

	this.members = remainingMembers;

	return this.save(function(err) {
		if(err) {
			return callback(err);
		}

		return User.update({_id: userId}, {$unset: {guild: ''}}, function(err) {
			if(err) {
				return callback(err);
			}

			return callback(null, this);
		});
	});
};


/**
 * Remove all of the members from this guild
 * @param {Function} callback
 */
GuildSchema.methods.removeAllMembers = function(callback) {
	var self = this;
	var members = _.clone(this.members);

	async.eachSeries(members, function(member, cb) {
		self.removeMember(member._id, function() {
			cb(null);
		});
	}, callback);
};


/**
 * Add a user to this guild
 * @param {ObjectId} userId
 * @param {Function} callback
 */
GuildSchema.methods.addMember = function(userId, callback) {
	var self = this;

	User.findById(userId, function(err, user) {
		if(err) {
			return callback(err);
		}
		if(!user) {
			return callback('user not found');
		}
		if(user.guild) {
			return callback('user is already in guild '+user.guild);
		}

		user.guild = self._id;

		return user.save(function(err) {
			if(err) {
				return callback(err);
			}

			self.members.push(_.pick(user, '_id', 'name', 'site', 'group'));

			return self.save(function(err) {
				if(err) {
					return callback(err);
				}

				return callback(null, this);
			});
		});
	});
};



GuildSchema.methods.addToJoinRequests = function(user, callback) {
	var matches = _.filter(this.joinRequests, function(jr) {
		return jr._id === user._id;
	});
	if(matches.length > 0) {
		return callback('User is already in joinRequests');
	}
	var nameDisplay = _.pick(user, '_id', 'name', 'site', 'group');
	this.joinRequests.push(nameDisplay);
	return this.save(callback);
};


GuildSchema.methods.removeFromJoinRequests = function(user, callback) {
	var remaining = _.filter(this.joinRequests, function(jr) {
		return jr._id !== user._id;
	});
	if(remaining.length === this.joinRequests.length) {
		return callback('User is not in joinRequests');
	}
	this.joinRequests = remaining;
	return this.save(callback);
};


GuildSchema.methods.addToInvitations = function(user, callback) {
	var matches = _.filter(this.invitations, function(jr) {
		return jr._id === user._id;
	});
	if(matches.length > 0) {
		return callback('User is already in invitations');
	}
	var nameDisplay = _.pick(user, '_id', 'name', 'site', 'group');
	this.invitations.push(nameDisplay);
	return this.save(callback);
};


GuildSchema.methods.removeFromInvitations = function(user, callback) {
	var remaining = _.filter(this.invitations, function(jr) {
		return jr._id !== user._id;
	});
	if(remaining.length === this.invitations.length) {
		return callback('User is not in invitations');
	}
	this.invitations = remaining;
	return this.save(callback);
};


module.exports = GuildSchema;