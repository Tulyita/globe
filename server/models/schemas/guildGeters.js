'use strict';

var _ = require('lodash');

module.exports = function(schema) {


	/**
	 * Find a user by their _id
	 * _id and userId are typecast to string for the comparison
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
	 * Find member by their userId
	 * @param {ObjectId} userId
	 * @returns {*}
	 */
	schema.methods.getMember = function(userId) {
		return this.getUserFrom('members', userId);
	};


	/**
	 * Returns user if user.mod = true
	 * @param {ObjectId} userId
	 * @returns {*}
	 */
	schema.methods.getGuildMod = function(userId) {
		var user = this.getUserFrom('members', userId);
		if(user && user.mod) {
			return user;
		}
		return null;
	};


	/**
	 * Returns user from owner array
	 * @param {ObjectId} userId
	 * @returns {*}
	 */
	schema.methods.getOwner = function(userId) {
		return this.getUserFrom('owners', userId);
	};


	/**
	 * Returns an invite
	 * @param {ObjectId} userId
	 * @returns {*}
	 */
	schema.methods.getInvite = function(userId) {
		return this.getUserFrom('invites', userId);
	};


	/**
	 * Returns kick
	 * @param {ObjectId} userId
	 * @returns {*}
	 */
	schema.methods.getKick = function(userId) {
		return this.getUserFrom('kicks', userId);
	};


	/**
	 * Returns applicant
	 * @param {ObjectId} userId
	 * @returns {*}
	 */
	schema.methods.getApplicant = function(userId) {
		return this.getUserFrom('applicants', userId);
	};
};


