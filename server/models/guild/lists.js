'use strict';

var _ = require('lodash');
var async = require('async');
var User = require('../../models/user');
var isNameDisplay = require('../../validators/isNameDisplay');

module.exports = function(schema) {


	/**
	 * Remove all of the members from this guild
	 * @param {string} guildId
	 * @param {Function} callback
	 */
	schema.statics.removeAllMembers = function(guildId, callback) {
		var self = this;
		self.findById(guildId, function(err, guild) {
			if(err) {
				return callback(err);
			}
			if(!guild) {
				return callback('Guild "'+guildId+'" not found.');
			}

			return async.eachSeries(guild.members, function(member, cb) {
				self.removeMember(guildId, member._id, cb);
			}, callback);
		});
	};


	/**
	 * Add user to members list and set the guild value on their account
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.statics.addMember = function(guildId, userId, callback) {
		var self = this;
		self.addUserToList('members', guildId, userId, function(err) {
			if(err) {
				return callback(err);
			}

			return User.update({_id: userId}, {$set: {guild: guildId}}, function(err) {
				if(err) {
					return callback(err);
				}

				return callback(null, this);
			});
		});
	};


	/**
	 * Remove user from members list and unset the guild value on their account
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.statics.removeMember = function(guildId, userId, callback) {
		var self = this;
		self.removeUserFromList('members', guildId, userId, function(err) {
			if(err) {
				return callback(err);
			}

			return User.update({_id: userId, guild: guildId}, {$unset: {guild: ''}}, function(err) {
				if(err) {
					return callback(err);
				}

				return callback(null, this);
			});
		});
	};



	/**
	 * Add a user to an array
	 * @param {string} list
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.statics.addUserToList = function(list, guildId, userId, callback) {
		var self = this;
		User.findById(userId, function(err, user) {
			if(err) {
				return callback(err);
			}
			if(!user) {
				return callback('User "'+userId+'" not found.');
			}

			var nameDisplay = _.pick(user, '_id', 'name', 'site', 'group');

			if(!isNameDisplay(nameDisplay)) {
				return callback('Name display is invalid somehow, beats me.');
			}

			var update = {$addToSet: {}};
			update.$addToSet[list] = nameDisplay;

			return self.update({_id: guildId}, update, callback);
		});
	};


	/**
	 * Remove a user from an array
	 * @param {string} list
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.statics.removeUserFromList = function(list, guildId, userId, callback) {
		var self = this;
		var update = {$pull: {}};
		update.$pull[list] = {_id: userId};
		return self.update({_id: guildId}, update, callback);
	};
};