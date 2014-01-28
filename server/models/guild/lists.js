'use strict';

var _ = require('lodash');
var async = require('async');
var User = require('../../models/user');
var isNameDisplay = require('../../validators/isNameDisplay');

module.exports = function(schema) {


	/**
	 *
	 * @param {string} listName
	 * @param {ObjectId} userId
	 * @returns {Object} user
	 */
	schema.methods.getUserFrom = function(listName, userId) {
		var arr = this[listName];
		var matches = _.where(arr, function(member) {
			return String(member._id) === String(userId);
		});
		return matches[0];
	};


	/**
	 * Remove all of the members from this guild
	 * @param {Function} callback
	 */
	schema.methods.removeAllMembers = function(callback) {
		var self = this;
		var members = _.clone(this.members);

		var iterator = function(member, cb) {
			User.update({_id: member._id, guild: self._id}, {$unset: {guild: ''}}, cb);
		};

		async.eachSeries(members, iterator, function(err) {
			if(err) {
				return callback(err);
			}

			self.members = [];
			return self.save(callback);
		});
	};


	/**
	 * Add a user to this guild
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.methods.addMember = function(userId, callback) {
		var self = this;

		self.addUserToList('members', function(err) {
			if(err) {
				return callback(err);
			}

			return User.update({_id: userId}, {$set: {guild: self._id}}, function(err) {
				if(err) {
					return callback(err);
				}

				return callback(null, this);
			});
		});
	};


	/**
	 * Remove a member from this guild
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.methods.removeMember = function(userId, callback) {
		var self = this;

		self.removeUserFromList('members', userId, function(err) {
			if(err) {
				return callback(err);
			}

			return User.update({_id: userId, guild: self._id}, {$unset: {guild: ''}}, function(err) {
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
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.methods.addUserToList = function(list, userId, callback) {
		var self = this;
		self[list] = _.filter(self[list], {_id: userId});

		User.findById(userId, function(err, user) {
			if(err) {
				return callback(err);
			}
			if(!user) {
				return callback('User "'+userId+'" not found.');
			}

			var nameDisplay = _.pick(user, '_id', 'name', 'site', 'group');

			self[list].push(nameDisplay);

			return self.save(callback);
		});
	};


	/**
	 * Remove a member from an array and save
	 * @param {string} list
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	schema.methods.removeUserFromList = function(list, userId, callback) {
		var self = this;
		self[list] = _.filter(self[list], {_id: userId});

		return self.save(callback);
	};



	/**
	 * Remove user from applicants and add them to members
	 * @param userId
	 * @param callback
	 */
	schema.methods.acceptJoinRequest = function(userId, callback) {
	 var self = this;
	 self.addMember(userId, function(err) {
		 if(err) {
		 	return callback(err);
		 }

		 return self.removeUserFromList('applicants', userId, callback);
	 });
	};


	/**
	 * Remove user from invitations and add them to members
	 * @param userId
	 * @param callback
	 */
	schema.methods.acceptInvitation = function(userId, callback) {
		var self = this;
		self.addMember(userId, function(err) {
			if(err) {
				return callback(err);
			}

			return self.removeUserFromList('invitations', userId, callback);
		});
	};
















	/**
	 * Add a user to an array
	 * @param {string} list
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	/*schema.statics.addUserToList = function(list, guildId, userId, callback) {
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
	 };*/


	/**
	 * Remove a user from an array
	 * @param {string} list
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	/*schema.statics.removeUserFromList = function(list, guildId, userId, callback) {
	 var self = this;
	 var update = {$pull: {}};
	 update.$pull[list] = {_id: userId};
	 return self.update({_id: guildId}, update, callback);
	 };*/


	/**
	 * Remove user from members list and unset the guild value on their account
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	/*schema.statics.removeMember = function(guildId, userId, callback) {
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
	 };*/


	/**
	 * Add user to members list and set the guild value on their account
	 * @param {string} guildId
	 * @param {ObjectId} userId
	 * @param {Function} callback
	 */
	/*schema.statics.addMember = function(guildId, userId, callback) {
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
	 };*/



	/**
	 * Remove all of the members from this guild
	 * @param {string} guildId
	 * @param {Function} callback
	 */
	/*schema.statics.removeAllMembers = function(guildId, callback) {
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
	 };*/


	/**
	 * Remove user from applicants and add them to members
	 * @param guildId
	 * @param userId
	 * @param callback
	 */
	/*schema.statics.acceptJoinRequest = function(guildId, userId, callback) {
		var self = this;
		self.addMember(guildId, userId, function(err) {
			if(err) {
				return callback(err);
			}

			self.removeUserFromList('applicants', data.guildId, data.userId, callback);
		});
	};*/
};