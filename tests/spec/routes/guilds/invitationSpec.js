'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var invitation = require('../../../../server/routes/guilds/invitation');
var Guild = require('../../../../server/models/guild');
var User = require('../../../../server/models/user');

describe('routes/guilds/invitation', function() {

	var userId, ownerId, invitedId, guild;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		ownerId = mongoose.Types.ObjectId();
		invitedId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers', invitations: [{_id: invitedId, name: 'aaaa', site: 'j', group: 'u'}]}, function(err, _guild_) {
			guild = _guild_;
			User.create({_id: invitedId, name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err2) {
				User.create({_id: userId, name: 'bbbb', site: 'j', group: 'u', siteUserId: '124'}, function(err3) {
					done(err || err2 || err3);
				});
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('put', function() {

		it('should put an invitation', function(done) {
			var req = {
				session: {
					userId: ownerId
				},
				params: {
					guildId: 'racer',
					userId: userId
				},
				guild: guild
			};
			invitation.put(req, {apiOut: function(err, res) {
				expect(res._id).toEqual(userId);
				expect(guild.invitations[1]._id).toEqual(userId);
				done(err);
			}});
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('post', function() {

		it('should accept an invitation', function(done) {
			var req = {
				params: {
					guildId: 'racer',
					userId: invitedId
				},
				query: {
					action: 'accept'
				},
				guild: guild
			};
			invitation.post(req, {apiOut: function(err, res) {
				expect(res).toBeFalsy();
				expect(guild.invitations.length).toEqual(0);
				done(err);
			}});
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('get', function() {

		it('should get an invitation', function(done) {
			var req = {
				params: {
					guildId: 'racer',
					userId: invitedId
				},
				guild: guild
			};
			invitation.get(req, {apiOut: function(err, res) {
				expect(res._id).toEqual(invitedId);
				done(err);
			}});
		});
	});


	////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////

	describe('del', function() {

		it('should delete an invitation', function(done) {
			var req = {
				params: {
					guildId: 'racer',
					userId: invitedId
				},
				guild: guild
			};
			invitation.del(req, {status: function(code) {
				expect(code).toEqual(204);
				return {send: function(msg) {
					expect(msg).toBeFalsy();
					expect(guild.invitations.length).toBe(0);
					done();
				}};
			}});
		});
	});
});