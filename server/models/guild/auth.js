'use strict';

var _ = require('lodash');

module.exports = function(schema) {


	/**
	 * Find member by their userId
	 * @param {ObjectId} userId
	 * @returns {*}
	 */
	schema.methods.getMember = function(userId) {
		var matches = _.where(this.members, {_id: userId});
		return matches[0];
	};


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
		return _.where(this.members, {_id: userId, mod: true}) > 0;
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
	 * Returns true if userId matches a applicant
	 * @param {ObjectId} userId
	 * @returns {boolean}
	 */
	schema.methods.isApplicant = function(userId) {
		return _.where(this.applicants, {_id: userId}).length > 0;
	};







	/*schema.static.isGuildMod = function(guildId, userId, callback) {
	 this.findOne({_id: guildId, 'members._id': userId, mod: true}, {_id: 1}, function(err, doc) {
	 return callback(null, !!doc);
	 });
	 };*/

	/*schema.static.isOwner = function(guildId, userId, callback) {
	 this.findOne({_id: guildId, 'owners._id': userId}, {_id: 1}, function(err, doc) {
	 return callback(null, !!doc);
	 });
	 };*/

	/*schema.static.isInvited = function(guildId, userId, callback) {
	 this.findOne({_id: guildId, 'invitations._id': userId}, {_id: 1}, function(err, doc) {
	 return callback(null, !!doc);
	 });
	 };*/

	/*schema.static.isKicked = function(guildId, userId, callback) {
	 this.findOne({_id: guildId, 'kicks._id': userId}, {_id: 1}, function(err, doc) {
	 return callback(null, !!doc);
	 });
	 };*/

	/*schema.static.isMember = function(guildId, userId, callback) {
	 this.findOne({_id: guildId, 'members._id': userId}, {_id: 1}, function(err, doc) {
	 return callback(null, !!doc);
	 });
	 };*/

	 /*schema.static.isRequester = function(guildId, userId, callback) {
	 this.findOne({_id: guildId, 'applicants._id': userId}, {_id: 1}, function(err, doc) {
	 return callback(null, !!doc);
	 });
	 };*/

};


