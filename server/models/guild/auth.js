'use strict';

var _ = require('lodash');

module.exports = function(schema) {


	/**
	 * Returns true if userId matches a member
	 * @param {ObjectId} userId
	 * @returns {boolean}
	 */
	schema.methods.isMember = function(userId) {
		return _.where(this.members, {_id: userId}).length > 0;
	};


	/**
	 * Returns true if member.mod is true
	 * @param {ObjectId} userId
	 * @returns {boolean}
	 */
	schema.methods.isGuildMod = function(userId) {
		var matches = _.where(this.members, {_id: userId});
		if(matches.length === 0) {
			return false;
		}
		var member = matches[0];
		return member.mod;
	};


	/**
	 * Returns true if userId is in owners array
	 * @param {ObjectId} userId
	 * @returns {boolean}
	 */
	schema.methods.isOwner = function(userId) {
		return _.where(this.owners, {_id: userId}).length > 0;
	};


	/**
	 * Returns true if userId matches an invite
	 * @param {ObjectId} userId
	 * @returns {boolean}
	 */
	schema.methods.isInvited = function(userId) {
		return _.where(this.invitations, {_id: userId}).length > 0;
	};


	/**
	 * Returns true if userId matches a kick
	 * @param {ObjectId} userId
	 * @returns {boolean}
	 */
	schema.methods.isKicked = function(userId) {
		return _.where(this.kicks, {_id: userId}).length > 0;
	};


	/**
	 * Returns true if userId matches a joinRequest
	 * @param {ObjectId} userId
	 * @returns {boolean}
	 */
	schema.methods.isRequester = function(userId) {
		return _.where(this.joinRequests, {_id: userId}).length > 0;
	};
};


